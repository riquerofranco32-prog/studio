/**
 * Test de no-regresión de `prefers-reduced-motion`.
 *
 *   npm run motion-check                      (contra http://localhost:3000)
 *   npm run motion-check -- https://tu-url    (contra un deploy)
 *
 * Corre la página dos veces: una con la preferencia en `no-preference`
 * (CONTROL) y otra en `reduce` (TEST). En cada parada de scroll saca dos
 * muestras de `transform` y `opacity` de TODOS los elementos, separadas por
 * 500 ms, y compara.
 *
 * La pasada de control no es decorativa: si el probe no ve movimiento cuando el
 * movimiento existe, no está midiendo nada. El criterio es
 *
 *   CONTROL debe detectar movimiento   y   TEST debe detectar cero.
 *
 * Nota sobre qué hace `reducedMotion="user"` de framer-motion: descarta sólo
 * las claves posicionales (transforms + width/height/top/left/right/bottom),
 * que saltan al valor final. `opacity` SÍ sigue animando a propósito — sin
 * movimiento, no sin interfaz. Por eso el veredicto mira transform, y reporta
 * opacity aparte como informativo.
 */
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";

// Paradas elegidas por lo que vive en cada una, no por repartir el scroll:
// hero (paralaje), Proof (contadores), Trabajo (reveal + spotlight de tarjetas),
// Proceso (paso activo) y Contacto (RevealText).
const STOPS = [0, 900, 2200, 4200, 6200];
const SETTLE = 500;

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
  console.error(
    "No se encontró Chrome. Correr `npx puppeteer browsers install chrome` o exportar CHROME_PATH.",
  );
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

/** Corre una pasada completa y devuelve los elementos que se movieron. */
async function run(preference) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: preference },
  ]);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  // Deja terminar la entrada del hero antes de empezar a medir.
  await new Promise((r) => setTimeout(r, 2500));

  const movers = new Map();
  let opacityOnly = 0;

  for (const y of STOPS) {
    const found = await page.evaluate(
      async (scrollY, settle) => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, scrollY);
        // Un respiro para que el IntersectionObserver dispare los reveals: la
        // idea es medirlos MIENTRAS animarían, no después.
        await new Promise((r) => setTimeout(r, 80));

        const sample = () => {
          const out = new Map();
          for (const el of document.querySelectorAll("body *")) {
            const s = getComputedStyle(el);
            // La marquesina es CSS infinito por diseño y bajo reduced-motion la
            // apaga el bloque global de globals.css; el shader es un <canvas>
            // que no anima vía estilos. Ninguno de los dos es lo que se audita.
            if (el.closest(".marquee") || el.tagName === "CANVAS") continue;
            out.set(el, { t: s.transform, o: s.opacity });
          }
          return out;
        };

        const describe = (el) => {
          const cls =
            typeof el.className === "string" && el.className
              ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
              : "";
          return el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") + cls;
        };

        const a = sample();
        await new Promise((r) => setTimeout(r, settle));
        const b = sample();

        const moved = [];
        for (const [el, before] of a) {
          const after = b.get(el);
          if (!after) continue;
          const tChanged = before.t !== after.t;
          const oChanged = before.o !== after.o;
          if (tChanged || oChanged) {
            moved.push({
              sel: describe(el).slice(0, 64),
              transform: tChanged ? `${before.t} → ${after.t}` : null,
              opacity: oChanged ? `${before.o} → ${after.o}` : null,
            });
          }
        }
        return moved;
      },
      y,
      SETTLE,
    );

    for (const m of found) {
      if (m.transform) movers.set(m.sel + "|" + y, { ...m, stop: y });
      else opacityOnly++;
    }
  }

  // Censo de lo que se apaga por JS. No lo cubre el muestreo de transform:
  // estos elementos no animan más despacio bajo reduced-motion, directamente
  // no se montan. El <canvas> del shader además dibuja píxeles, no estilos,
  // así que un diff de computed styles nunca lo vería.
  const gates = await page.evaluate(() => ({
    shader: document.querySelectorAll("canvas").length,
    ping: document.querySelectorAll(".animate-ping").length,
    spotlight: document.querySelectorAll('a[href^="/work/"] div[style*="radial-gradient"]').length,
    roster: document.querySelectorAll('img[src*="/team/"]').length,
  }));

  await page.close();
  return { movers: [...movers.values()], opacityOnly, consoleErrors, gates };
}

console.log(`\nURL: ${URL}`);
console.log(`Paradas de scroll: ${STOPS.join(", ")} px · ventana de muestreo: ${SETTLE} ms\n`);

const control = await run("no-preference");
const test = await run("reduce");
await browser.close();

const line = "─".repeat(74);

console.log(line);
console.log(`CONTROL  (prefers-reduced-motion: no-preference)`);
console.log(line);
console.log(`  elementos con transform en movimiento : ${control.movers.length}`);
console.log(`  cambios sólo de opacidad             : ${control.opacityOnly}`);
console.log(`  errores de consola                   : ${control.consoleErrors.length}`);
for (const m of control.movers.slice(0, 8)) {
  console.log(`    · [y=${m.stop}] ${m.sel}`);
  console.log(`        ${m.transform}`);
}
if (control.movers.length > 8) console.log(`    … y ${control.movers.length - 8} más`);

console.log(`\n${line}`);
console.log(`TEST     (prefers-reduced-motion: reduce)`);
console.log(line);
console.log(`  elementos con transform en movimiento : ${test.movers.length}`);
console.log(`  cambios sólo de opacidad             : ${test.opacityOnly}   (esperado: framer conserva opacidad)`);
console.log(`  errores de consola                   : ${test.consoleErrors.length}`);
for (const m of test.movers) {
  console.log(`    · [y=${m.stop}] ${m.sel}`);
  console.log(`        ${m.transform}`);
}

console.log(`
${line}`);
console.log("GATES POR JS — elementos que no se montan bajo reduced-motion");
console.log(line);
console.log("  elemento              control   reduce");
for (const k of Object.keys(control.gates)) {
  const c = control.gates[k];
  const t = test.gates[k];
  // Si el control tampoco lo vio, no hay nada que apagar: decir 'apagado'
  // ahí sería reportar un éxito que no se midió.
  const estado =
    c === 0 ? '— no observado' : t === 0 ? '✓ apagado' : c === t ? '✗ sigue montado' : '✗ parcial';
  console.log(`  ${k.padEnd(20)}  ${String(c).padStart(5)}   ${String(t).padStart(5)}   ${estado}`);
}

const failures = [];
if (control.movers.length === 0) {
  failures.push(
    "el CONTROL no detectó ningún movimiento — el probe no está midiendo nada, revisar selectores o paradas",
  );
}
if (test.movers.length > 0) {
  failures.push(
    `${test.movers.length} elemento(s) siguen moviéndose con reduced-motion activo`,
  );
}
// El shader, el ping y el spotlight se apagan por JS: bajo reduced-motion
// tienen que desaparecer del DOM, no sólo dejar de animar.
for (const k of ["shader", "ping", "spotlight"]) {
  if (control.gates[k] === 0)
    failures.push(`el control no encontró ningún "${k}" — el censo no está midiendo nada`);
  else if (test.gates[k] !== 0)
    failures.push(`"${k}" sigue montado con reduced-motion (${test.gates[k]} elemento/s)`);
}

if (test.consoleErrors.length) {
  failures.push(`${test.consoleErrors.length} errores de consola con reduced-motion`);
}

console.log("");
if (failures.length) {
  console.error(`FALLA:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.error(
  `OK — el control detectó ${control.movers.length} elemento(s) en movimiento y con reduced-motion no se mueve ninguno.`,
);
