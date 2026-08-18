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
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";
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
console.log("Recordatorio: el throttling de CDP frena CPU, no GPU. Un fragment shader");
console.log("de 80 iteraciones por píxel es fill-rate, o sea GPU. Estos números miden");
console.log("la presión sobre el hilo principal, no lo que va a costar en un teléfono.");
console.log(line);
