/**
 * Costo real del shader del hero, medido.
 *
 *   npm run shader-cost                      (contra http://localhost:3000)
 *   npm run shader-cost -- https://tu-url    (contra un deploy)
 *
 * El shader Phosphor hace 80 iteraciones de raymarching POR PÍXEL en un
 * fragment shader. Viene apareciendo como "el techo de performance" del sitio
 * en cada fase sin que nadie lo haya medido nunca. Esto lo mide.
 *
 * Método: se toman los deltas de requestAnimationFrame durante 3s con el hero
 * en pantalla, primero con el canvas montado y después quitándolo del DOM. Al
 * quitarlo, el IntersectionObserver del propio componente pausa su loop, así
 * que la única variable entre las dos muestras es el shader. Misma posición de
 * scroll, mismas animaciones CSS corriendo, misma página.
 *
 * Se repite con throttling de CPU (CDP Emulation.setCPUThrottlingRate) para
 * aproximar un dispositivo lento.
 *
 * LÍMITE IMPORTANTE, leer antes de sacar conclusiones: un fragment shader es
 * trabajo de GPU, y el throttling de CDP sólo frena la CPU. Estos números
 * capturan el costo de CPU del loop y la presión sobre el hilo principal, NO el
 * costo de fill-rate en la GPU de un teléfono. El renderer que usa esta corrida
 * se imprime abajo justamente para eso: si dice SwiftShader, es rasterizado por
 * software y no representa a ningún dispositivo real. El número que decide es
 * el que se mide a mano en un Android.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const args = process.argv.slice(2);
const LEVERS = args.includes("--levers");
const URL = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000";
const THROTTLES = [1, 4, 6];
const SAMPLE_MS = 3000;

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const root = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(root)) return null;
  for (const dir of readdirSync(root)) {
    for (const bin of [
      join(root, dir, "chrome-win64", "chrome.exe"),
      join(root, dir, "chrome-linux64", "chrome"),
      join(
        root,
        dir,
        "chrome-mac-arm64",
        "Google Chrome for Testing.app",
        "Contents",
        "MacOS",
        "Google Chrome for Testing",
      ),
    ]) {
      if (existsSync(bin)) return bin;
    }
  }
  return null;
}

const executablePath = findChrome();
if (!executablePath) {
  console.error("No se encontró Chrome. Correr `npx puppeteer browsers install chrome`.");
  process.exit(1);
}

// Sin --disable-gpu: si la máquina tiene GPU real queremos usarla, y si no, que
// el renderer lo diga.
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars"],
});

/** Deltas de rAF durante SAMPLE_MS, resumidos. */
const measure = (page, ms) =>
  page.evaluate(async (duration) => {
    const deltas = [];
    let last = performance.now();
    const end = last + duration;
    await new Promise((resolve) => {
      const tick = (now) => {
        deltas.push(now - last);
        last = now;
        if (now < end) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    // El primer delta arrastra el tiempo de arranque, no es un frame.
    deltas.shift();
    const sorted = [...deltas].sort((a, b) => a - b);
    const at = (q) => sorted[Math.floor(sorted.length * q)] ?? 0;
    return {
      frames: deltas.length,
      fps: +(1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length)).toFixed(1),
      medianaMs: +at(0.5).toFixed(2),
      p95Ms: +at(0.95).toFixed(2),
      peorMs: +at(0.999).toFixed(2),
      // 16.7ms = el presupuesto de un frame a 60Hz.
      framesLargos: +((deltas.filter((d) => d > 16.7).length / deltas.length) * 100).toFixed(1),
    };
  }, ms);

if (LEVERS) {
  // ── Palancas del shader, medidas sin tocar el componente ──────────────────
  // El GLSL sale del archivo real (components/ui/phosphor-shader.tsx), se le
  // aplican las variantes por texto y cada una corre en un canvas propio del
  // mismo tamaño que el hero. Es un micro-benchmark del shader, no de la
  // página: aísla exactamente lo que las palancas cambian, y los deltas
  // relativos entre variantes son lo que sirve para decidir.
  const src = readFileSync("components/ui/phosphor-shader.tsx", "utf8");
  const frag = src.slice(src.indexOf("#version 300 es"), src.indexOf("`;", src.indexOf("#version 300 es")));
  const vert = src.slice(src.lastIndexOf("#version 300 es"), src.lastIndexOf("`;"));

  const variantes = [
    { nombre: "base (80 iter, DPR 1.5)", iter: 80, escala: 1.5 },
    { nombre: "40 iteraciones", iter: 40, escala: 1.5 },
    { nombre: "DPR 1.0", iter: 80, escala: 1.0 },
    { nombre: "media resolución (DPR 0.75)", iter: 80, escala: 0.75 },
  ];

  const lp = await browser.newPage();
  await lp.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await lp.goto("about:blank");

  const out = [];
  for (const v of variantes) {
    // 8e1 es como está escrito el 80 en el fuente.
    // GLSL tipa estricto: el contador es float, asi que 40 tiene que ser 40.0.
    const fragVar = frag.replace("i++ < 8e1", `i++ < ${v.iter}.0`);
    const r = await lp.evaluate(
      async (fragSrc, vertSrc, escala, ms) => {
        const cv = document.createElement("canvas");
        cv.width = Math.floor(1440 * escala);
        cv.height = Math.floor(900 * escala);
        document.body.appendChild(cv);
        const gl = cv.getContext("webgl2");
        if (!gl) return { error: "sin WebGL2" };

        const compile = (type, s) => {
          const sh = gl.createShader(type);
          gl.shaderSource(sh, s);
          gl.compileShader(sh);
          if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(sh));
          return sh;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
          return { error: gl.getProgramInfoLog(prog) };

        const vao = gl.createVertexArray();
        const vbo = gl.createBuffer();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.viewport(0, 0, cv.width, cv.height);

        const uRes = gl.getUniformLocation(prog, "iResolution");
        const uTime = gl.getUniformLocation(prog, "iTime");
        const t0 = performance.now();
        const deltas = [];
        let last = performance.now();

        await new Promise((resolve) => {
          const tick = (now) => {
            deltas.push(now - last);
            last = now;
            gl.useProgram(prog);
            if (uRes) gl.uniform3f(uRes, cv.width, cv.height, 1);
            if (uTime) gl.uniform1f(uTime, (now - t0) / 1000);
            gl.bindVertexArray(vao);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (now - t0 < ms) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        // Forzar el vaciado de la cola de GPU: sin esto se mide el encolado,
        // no el dibujado.
        gl.finish();
        cv.remove();

        deltas.shift();
        const sorted = [...deltas].sort((a, b) => a - b);
        const at = (q) => sorted[Math.floor(sorted.length * q)] ?? 0;
        return {
          px: cv.width * cv.height,
          fps: +(1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length)).toFixed(1),
          medianaMs: +at(0.5).toFixed(2),
          p95Ms: +at(0.95).toFixed(2),
        };
      },
      fragVar,
      vert,
      v.escala,
      SAMPLE_MS,
    );
    out.push({ ...v, ...r });
  }
  const lpRenderer = lp.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "sin WebGL2";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  const rendValue = await lpRenderer;
  await lp.close();
  await browser.close();

  const l = "─".repeat(78);
  const rend = rendValue;
  console.log(`Renderer WebGL: ${rend}`);
  console.log("PALANCAS DEL SHADER — micro-benchmark, NADA aplicado al código");
  console.log("");
  console.log(l);
  console.log("  variante                        píxeles     fps   mediana    vs base");
  console.log(l);
  const base = out[0];
  for (const v of out) {
    if (v.error) {
      console.log(`  ${v.nombre.padEnd(30)} ERROR: ${v.error}`);
      continue;
    }
    const delta = +(v.medianaMs - base.medianaMs).toFixed(2);
    const pct = base.medianaMs ? Math.round((delta / base.medianaMs) * 100) : 0;
    console.log(
      `  ${v.nombre.padEnd(30)}${(v.px / 1e6).toFixed(2)}M${String(v.fps).padStart(8)}${String(v.medianaMs).padStart(9)}ms${(v === base ? "        —" : `${delta > 0 ? "+" : ""}${delta}ms (${pct > 0 ? "+" : ""}${pct}%)`).padStart(18)}`,
    );
  }
  console.log(l);
  console.log("Micro-benchmark del fragment shader aislado, a 1440×900 lógicos. No");
  console.log("incluye el resto de la página, así que los valores absolutos son más");
  console.log("bajos que los de la corrida normal; lo que vale es el delta entre filas.");
  console.log(l);
  process.exit(0);
}

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
const client = await page.createCDPSession();

await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));

const renderer = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl2");
  if (!gl) return "sin WebGL2";
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
});

const filas = [];
for (const rate of THROTTLES) {
  // Recarga limpia por cada tasa: el canvas se quitó en la vuelta anterior.
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => window.scrollTo(0, 0));
  await client.send("Emulation.setCPUThrottlingRate", { rate });
  await new Promise((r) => setTimeout(r, 800));

  const con = await measure(page, SAMPLE_MS);

  // Quitar el canvas: su IntersectionObserver ve que dejó de intersecar y
  // pausa el loop. Todo lo demás sigue igual.
  const habia = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return false;
    c.remove();
    return true;
  });
  await new Promise((r) => setTimeout(r, 800));
  const sin = await measure(page, SAMPLE_MS);

  filas.push({ rate, con, sin, habia });
}

// ── Costo propio del pin del Proceso ────────────────────────────────────────
// El pin es CSS sticky (compositor) más un useScroll que lee progreso y setea
// estado. La pregunta es si eso cuesta frames por su cuenta. Se compara contra
// Servicios, una sección sin nada atado al scroll. En las dos el hero está
// fuera de pantalla, así que el shader está pausado por su IntersectionObserver
// y no contamina la medición.
const pin = [];
for (const rate of [1, 4]) {
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  const posiciones = await page.evaluate(() => {
    const pinEl = document.querySelector('[data-pin="process"]');
    const services = document.getElementById("services");
    return {
      // Mitad del recorrido pineado: el paso activo está cambiando ahí.
      pin: pinEl ? Math.round(pinEl.offsetTop + (pinEl.offsetHeight - window.innerHeight) / 2) : null,
      plano: services ? services.offsetTop + 200 : null,
      hayPin: !!pinEl,
    };
  });

  await client.send("Emulation.setCPUThrottlingRate", { rate });

  const medirEn = async (y) => {
    await page.evaluate((t) => window.scrollTo(0, t), y);
    await new Promise((r) => setTimeout(r, 1500));
    return measure(page, SAMPLE_MS);
  };

  const plano = await medirEn(posiciones.plano);
  // Barrer despacio el pin mientras se mide: quieto no cambia de paso y no se
  // estaría midiendo el trabajo que interesa.
  const enPin = await page.evaluate(async (y) => {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 1200));
    return true;
  }, posiciones.pin).then(async () => {
    const medicion = page.evaluate(async (duration) => {
      const deltas = [];
      let last = performance.now();
      const end = last + duration;
      await new Promise((resolve) => {
        const tick = (now) => {
          deltas.push(now - last);
          last = now;
          // Rueda suave todo el tiempo: fuerza al pin a recalcular progreso y
          // a cambiar de paso durante la medición.
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 24, bubbles: true, cancelable: true }));
          if (now < end) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
      deltas.shift();
      const sorted = [...deltas].sort((a, b) => a - b);
      const at = (q) => sorted[Math.floor(sorted.length * q)] ?? 0;
      return {
        frames: deltas.length,
        fps: +(1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length)).toFixed(1),
        medianaMs: +at(0.5).toFixed(2),
        p95Ms: +at(0.95).toFixed(2),
        peorMs: +at(0.999).toFixed(2),
        framesLargos: +((deltas.filter((d) => d > 16.7).length / deltas.length) * 100).toFixed(1),
      };
    }, SAMPLE_MS);
    return medicion;
  });

  pin.push({ rate, plano, enPin, hayPin: posiciones.hayPin });
}

await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
await browser.close();

const line = "─".repeat(78);
console.log(`\nURL: ${URL}`);
console.log(`Renderer WebGL: ${renderer}`);
console.log(`Muestra: ${SAMPLE_MS} ms por medición, hero en pantalla, scroll 0\n`);

for (const { rate, con, sin, habia } of filas) {
  console.log(line);
  console.log(`CPU throttling ×${rate}${rate === 1 ? "  (sin frenar)" : ""}${habia ? "" : "   [!] no se encontró canvas"}`);
  console.log(line);
  console.log("                    fps    mediana     p95     peor   frames >16.7ms");
  const fila = (etq, m) =>
    console.log(
      `  ${etq.padEnd(16)}${String(m.fps).padStart(6)}${String(m.medianaMs).padStart(10)}ms${String(m.p95Ms).padStart(8)}ms${String(m.peorMs).padStart(8)}ms${String(m.framesLargos).padStart(12)}%`,
    );
  fila("con shader", con);
  fila("sin shader", sin);
  const dif = +(con.medianaMs - sin.medianaMs).toFixed(2);
  const pct = sin.medianaMs ? Math.round((dif / sin.medianaMs) * 100) : 0;
  console.log(`\n  costo del shader en la mediana de frame: ${dif >= 0 ? "+" : ""}${dif} ms (${pct >= 0 ? "+" : ""}${pct}%)`);
  console.log("");
}

console.log(line);
console.log("PIN DEL PROCESO — costo propio, con el hero (y el shader) fuera de pantalla");
console.log(line);
for (const { rate, plano, enPin, hayPin } of pin) {
  if (!hayPin) {
    console.log(`  CPU ×${rate}: no se encontró [data-pin=process]`);
    continue;
  }
  console.log(`  CPU throttling ×${rate}`);
  console.log("                    fps    mediana     p95     peor   frames >16.7ms");
  const fila = (etq, m) =>
    console.log(
      `  ${etq.padEnd(16)}${String(m.fps).padStart(6)}${String(m.medianaMs).padStart(10)}ms${String(m.p95Ms).padStart(8)}ms${String(m.peorMs).padStart(8)}ms${String(m.framesLargos).padStart(12)}%`,
    );
  fila("sección plana", plano);
  fila("pin scrolleando", enPin);
  const dif = +(enPin.medianaMs - plano.medianaMs).toFixed(2);
  console.log(`  → costo propio del pin: ${dif >= 0 ? "+" : ""}${dif} ms por frame
`);
}

console.log(line);
console.log("Recordatorio: el throttling de CDP frena CPU, no GPU. Un fragment shader");
console.log("de 80 iteraciones por píxel es fill-rate, o sea GPU. Estos números miden");
console.log("la presión sobre el hilo principal, no lo que va a costar en un teléfono.");
console.log(line);
