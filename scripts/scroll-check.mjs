/**
 * Test de no-regresión del scroll suave (Lenis) y de las anclas de navegación.
 *
 *   npm run scroll-check                      (contra http://localhost:3000)
 *   npm run scroll-check -- https://tu-url    (contra un deploy)
 *
 * Lenis corre sobre el scroll NATIVO en vez de transformar un wrapper. Ese es
 * todo el motivo por el que se eligió, así que esto verifica precisamente eso:
 * que después de un scroll suave la posición real del documento se haya movido
 * y que todo lo que depende de ella siga funcionando.
 *
 *   1. window.scrollY se mueve de verdad (no es un transform simulado)
 *   2. se disparan eventos `scroll` nativos → alimentan IntersectionObserver
 *   3. el IntersectionObserver del navbar marca la sección activa
 *   4. el useScroll/useTransform del hero sigue aplicando el paralaje
 *   5. los reveals por viewport siguen disparando
 *   6. con prefers-reduced-motion, lerp se fuerza a 1: el scroll sigue al
 *      input 1:1, medido como curva de asentamiento contra el modo normal
 *
 * Y las anclas por los TRES caminos por los que se puede llegar a una, que es
 * lo que obligó a mover la compensación del navbar de un offset de JS a
 * scroll-margin-top en CSS:
 *
 *   A. click dentro de la misma ruta   → lo intercepta Lenis
 *   B. click viniendo de otra ruta     → lo resuelve el router de Next
 *   C. carga directa con el hash       → salto nativo del navegador
 *
 * El offset de Lenis sólo cubría A. scroll-margin-top cubre los tres, y por eso
 * las dos cosas juntas no van: se suman.
 *
 * Sale con código 1 si algo de eso deja de cumplirse.
 */
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";
/** Espeja el scroll-margin-top de las anclas en globals.css. */
const ANCHOR_OFFSET = 80;
/** El navbar cambia de alto al scrollear (h-20 → h-16), de ahí la tolerancia. */
const ANCHOR_TOLERANCE = 12;

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

const allConsoleErrors = [];

async function open(preference, path = "") {
  const page = await browser.newPage();
  page.on("console", (m) => m.type() === "error" && allConsoleErrors.push(m.text()));
  page.on("pageerror", (e) => allConsoleErrors.push(String(e)));
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: preference },
  ]);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL + path, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  return page;
}

/**
 * Curva de asentamiento tras un golpe de rueda: cuánto del recorrido total se
 * completó en el primer frame. Es la medida que distingue "suavizado" de
 * "1:1", y sirve para los dos modos.
 */
const settleCurve = (page) =>
  page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.scrollTo(0, 0);
    await sleep(300);
    const from = window.scrollY;
    window.dispatchEvent(
      new WheelEvent("wheel", { deltaY: 400, bubbles: true, cancelable: true }),
    );
    await sleep(70);
    const early = window.scrollY;
    await sleep(1400);
    const settled = window.scrollY;
    return {
      early: Math.round(early - from),
      settled: Math.round(settled - from),
      // 1.0 = llegó entero en el primer frame; 0.3 = venía suavizando.
      ratio: settled === from ? 0 : (early - from) / (settled - from),
    };
  });

// ── Scroll: pasada normal ───────────────────────────────────────────────────
const page = await open("no-preference");
const settleNormal = await settleCurve(page);

const normal = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = {};

  out.lenisActive = document.documentElement.classList.contains("lenis");

  // El grid del hero es el que lleva el paralaje por useScroll/useTransform.
  const grid = document.querySelector(
    'section div[aria-hidden][class*="background-image"]',
  );
  out.gridTransformAt0 = grid ? getComputedStyle(grid).transform : "NO-GRID";

  let nativeScrollEvents = 0;
  window.addEventListener("scroll", () => nativeScrollEvents++, { passive: true });

  // Rueda real, no scrollTo: es el camino que de verdad usa la persona.
  for (let i = 0; i < 12; i++) {
    window.dispatchEvent(
      new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true }),
    );
    await sleep(40);
  }
  await sleep(1200);

  out.nativeScrollEvents = nativeScrollEvents;
  out.scrollYAfterWheel = Math.round(window.scrollY);
  out.gridTransformAfter = grid ? getComputedStyle(grid).transform : "NO-GRID";
  out.headerScrolledStyle = document
    .querySelector("header")
    .className.includes("bg-background/80");
  out.navActive = [...document.querySelectorAll("header nav a")]
    .filter((a) => a.getAttribute("aria-current") === "true")
    .map((a) => a.getAttribute("href"));

  // Reveals por IntersectionObserver: las tarjetas ya vistas deben estar en 1.
  out.cardOpacities = [...document.querySelectorAll('a[href^="/work/"]')]
    .slice(0, 3)
    .map((c) => getComputedStyle(c.closest("[style]") ?? c.parentElement).opacity);

  return out;
});
await page.close();

// ── Scroll: pasada con reduced-motion ───────────────────────────────────────
const page2 = await open("reduce");
const settleReduced = await settleCurve(page2);
await page2.close();

// ── Anclas: los tres caminos ────────────────────────────────────────────────
const measureTop = (page, id) =>
  page.evaluate((sel) => {
    const el = document.getElementById(sel);
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  }, id);

// A. Click dentro de la misma ruta → lo intercepta Lenis.
const pageA = await open("no-preference");
await pageA.evaluate(async () => {
  document.querySelector('header nav a[href="/#work"]').click();
  await new Promise((r) => setTimeout(r, 2400));
});
const anchorA = await measureTop(pageA, "work");
await pageA.close();

// B. Click viniendo de otra ruta → Lenis NO interviene (distinto pathname),
//    lo resuelve el router de Next.
const pageB = await open("no-preference", "/work/takefyy");
await pageB.evaluate(async () => {
  const link = [...document.querySelectorAll("a")].find(
    (a) => a.getAttribute("href") === "/#work",
  );
  link.click();
  await new Promise((r) => setTimeout(r, 3000));
});
const anchorB = await measureTop(pageB, "work");
await pageB.close();

// C. Carga directa con el hash en la URL → salto nativo del navegador, sin
//    click que interceptar. Es el caso que ningún offset de JS puede cubrir.
const pageC = await open("no-preference", "/#contact");
const anchorC = await measureTop(pageC, "contact");
await pageC.close();

// ── Pin del Proceso: ¿se desincroniza del scroll suavizado de Lenis? ────────
// El pin es CSS sticky (lo mueve el compositor) y el paso activo sale de
// useScroll (lo lee JS). Si Lenis escribiera la posición después de que framer
// la lee, el paso cambiaría un frame tarde respecto de lo que se ve. Se mide en
// dos regímenes: en reposo tras asentar, y DURANTE un scroll continuo.
const pagePin = await open("no-preference");
const pin = await pagePin.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = document.querySelector('[data-pin="process"]');
  if (!el) return { error: "no se encontró [data-pin=process]" };

  const pasos = document.querySelectorAll("[data-pin] button").length;
  const rendered = () => {
    const btns = [...document.querySelectorAll("[data-pin] button")];
    return btns.findIndex((b) => b.getAttribute("aria-current") === "step");
  };
  const geom = () => {
    const top = el.offsetTop;
    const range = el.offsetHeight - window.innerHeight;
    return { top, range };
  };
  const esperado = (y) => {
    const { top, range } = geom();
    const prog = Math.max(0, Math.min(1, (y - top) / range));
    return Math.min(Math.floor(prog * pasos), pasos - 1);
  };

  // 1. En reposo: parar en el medio de la banda de cada paso.
  const reposo = [];
  for (let i = 0; i < pasos; i++) {
    const { top, range } = geom();
    const y = Math.round(top + (range * (i + 0.5)) / pasos);
    window.scrollTo(0, y);
    await sleep(1100);
    const sticky = el.firstElementChild.getBoundingClientRect().top;
    reposo.push({
      paso: i,
      scrollY: Math.round(window.scrollY),
      esperado: esperado(window.scrollY),
      renderizado: rendered(),
      stickyTop: Math.round(sticky),
    });
  }

  // 2. En movimiento: scroll continuo por rueda a lo largo del pin, muestreando
  //    posición y paso renderizado en el mismo frame.
  const { top } = geom();
  window.scrollTo(0, top);
  await sleep(1100);
  let desfasajes = 0;
  let muestras = 0;
  let maxDesfasaje = 0;
  for (let i = 0; i < 40; i++) {
    window.dispatchEvent(
      new WheelEvent("wheel", { deltaY: 200, bubbles: true, cancelable: true }),
    );
    await new Promise((r) => requestAnimationFrame(() => r()));
    const e = esperado(window.scrollY);
    const r = rendered();
    if (r !== -1) {
      muestras++;
      if (e !== r) {
        desfasajes++;
        maxDesfasaje = Math.max(maxDesfasaje, Math.abs(e - r));
      }
    }
  }

  return {
    pasos,
    reposo,
    enMovimiento: { muestras, desfasajes, maxDesfasaje },
    docHeight: document.body.scrollHeight,
  };
});

await pagePin.close();

// El pin estira el documento; el IntersectionObserver del navbar usa una banda
// de -45%/-50% del viewport, que es relativa y no debería inmutarse. Se
// comprueba en la sección que quedó DESPUÉS del pin.
//
// Va en una página limpia a propósito: hacerlo sobre la misma pestaña que venía
// de barrer el pin a fuerza de rueda dejaba inercia pendiente en Lenis, que
// después pisaba el scrollTo y movía la página fuera de #about. El primer
// intento reportó un falso negativo por eso.
const pageNav = await open("no-preference");
const navTrasPin = await pageNav.evaluate(async () => {
  const about = document.getElementById("about");
  window.scrollTo(0, about.offsetTop + 200);
  await new Promise((r) => setTimeout(r, 1300));
  return [...document.querySelectorAll("header nav a")]
    .filter((a) => a.getAttribute("aria-current") === "true")
    .map((a) => a.getAttribute("href"));
});
await pageNav.close();


await browser.close();

// ── Reporte ─────────────────────────────────────────────────────────────────
const line = "─".repeat(74);
const pct = (r) => Math.round(r * 100);
const ok = (v) => (v ? "✓" : "✗");

console.log(`\nURL: ${URL}\n`);
console.log(line);
console.log("SCROLL (prefers-reduced-motion: no-preference)");
console.log(line);
console.log(`  Lenis activo (html.lenis)          : ${normal.lenisActive}`);
console.log(`  eventos scroll nativos disparados  : ${normal.nativeScrollEvents}`);
console.log(`  window.scrollY tras la rueda       : ${normal.scrollYAfterWheel} px`);
console.log(`  paralaje del hero (useScroll)      : ${normal.gridTransformAt0} → ${normal.gridTransformAfter}`);
console.log(`  navbar en estado scrolleado        : ${normal.headerScrolledStyle}`);
console.log(`  navbar sección activa (IO)         : ${JSON.stringify(normal.navActive)}`);
console.log(`  opacidad de las tarjetas (reveals) : ${JSON.stringify(normal.cardOpacities)}`);
console.log(`  curva de asentamiento              : ${settleNormal.early}px de ${settleNormal.settled}px en el 1er frame (${pct(settleNormal.ratio)}%)`);

console.log(`\n${line}`);
console.log("SCROLL (prefers-reduced-motion: reduce → Lenis fuerza lerp 1)");
console.log(line);
console.log(`  curva de asentamiento              : ${settleReduced.early}px de ${settleReduced.settled}px en el 1er frame (${pct(settleReduced.ratio)}%)`);

const near = (v) => v !== null && Math.abs(v - ANCHOR_OFFSET) <= ANCHOR_TOLERANCE;
console.log(`\n${line}`);
console.log(`ANCLAS — top de la sección tras el salto (esperado ~${ANCHOR_OFFSET}px)`);
console.log(line);
console.log(`  A. home → /#work (Lenis)           : ${anchorA} px  ${ok(near(anchorA))}`);
console.log(`  B. /work/takefyy → /#work (router) : ${anchorB} px  ${ok(near(anchorB))}`);
console.log(`  C. carga directa /#contact (nativo): ${anchorC} px  ${ok(near(anchorC))}`);
console.log(`\n  errores de consola (todas las pasadas): ${allConsoleErrors.length}`);

console.log(`
${line}`);
console.log("PIN DEL PROCESO — sticky + useScroll conviviendo con Lenis");
console.log(line);
if (pin.error) {
  console.log(`  ${pin.error}`);
} else {
  console.log(`  docHeight con el pin               : ${pin.docHeight} px`);
  console.log("  en reposo:   paso  scrollY   esperado  renderizado   sticky.top");
  for (const r of pin.reposo) {
    const ok2 = r.esperado === r.renderizado ? '✓' : '✗';
    console.log(
      `               ${String(r.paso).padStart(5)}${String(r.scrollY).padStart(9)}${String(r.esperado).padStart(11)}${String(r.renderizado).padStart(13)}${String(r.stickyTop).padStart(13)}px  ${ok2}`,
    );
  }
  const m = pin.enMovimiento;
  console.log(
    `  en movimiento                     : ${m.desfasajes}/${m.muestras} muestras desfasadas (máx ${m.maxDesfasaje} paso/s)`,
  );
}
console.log(`  navbar activo después del pin      : ${JSON.stringify(navTrasPin)}`);

// ── Veredicto ───────────────────────────────────────────────────────────────
const fail = [];
if (!normal.lenisActive) fail.push("Lenis no se inicializó (falta html.lenis)");
if (normal.nativeScrollEvents === 0)
  fail.push("no se dispararon eventos scroll nativos — IntersectionObserver quedaría ciego");
if (normal.scrollYAfterWheel === 0)
  fail.push("window.scrollY no se movió — el scroll dejó de ser nativo");
if (normal.gridTransformAfter === normal.gridTransformAt0)
  fail.push("el paralaje del hero no reaccionó — useScroll roto");
if (!normal.headerScrolledStyle) fail.push("el navbar no pasó a estado scrolleado");
if (normal.navActive.length === 0)
  fail.push("el IntersectionObserver del navbar no marcó ninguna sección activa");
if (!normal.cardOpacities.includes("1"))
  fail.push("ninguna tarjeta llegó a opacidad 1 — los reveals no dispararon");

// Las dos caras del mismo hecho, y una hace de control de la otra: si el modo
// normal NO suavizara, la aserción de reduced-motion pasaría por casualidad.
if (settleNormal.ratio > 0.75)
  fail.push(
    `sin reduced-motion el scroll llegó al ${pct(settleNormal.ratio)}% en el primer frame: no hay suavizado, Lenis no está interpolando`,
  );
if (settleReduced.ratio < 0.9)
  fail.push(
    `con reduced-motion el scroll llegó sólo al ${pct(settleReduced.ratio)}% en el primer frame: debería seguir al input 1:1 (lerp forzado a 1)`,
  );

for (const [nombre, valor] of [
  ["A (click misma ruta, Lenis)", anchorA],
  ["B (click desde otra ruta, router de Next)", anchorB],
  ["C (carga directa con hash, nativo)", anchorC],
]) {
  if (valor === null) fail.push(`ancla ${nombre}: la sección no existe en el DOM`);
  else if (!near(valor))
    fail.push(
      `ancla ${nombre}: aterrizó en ${valor}px, se esperaba ~${ANCHOR_OFFSET}px — el navbar fijo tapa el borde de la sección`,
    );
}

if (pin.error) fail.push(`pin: ${pin.error}`);
else {
  for (const r of pin.reposo) {
    if (r.esperado !== r.renderizado)
      fail.push(
        `pin en reposo: en scrollY ${r.scrollY} corresponde el paso ${r.esperado} y se está mostrando el ${r.renderizado}`,
      );
    // El bloque pineado tiene que quedar clavado arriba del viewport.
    if (Math.abs(r.stickyTop) > 2)
      fail.push(`pin en reposo: el bloque sticky se despegó (top ${r.stickyTop}px, esperado 0)`);
  }
  // Durante el scroll continuo se tolera desfasaje de 1 paso —- es el frame
  // que tarda React en commitear el estado —- pero no que sea la norma.
  const m = pin.enMovimiento;
  if (m.muestras === 0) fail.push('pin: no se pudo leer el paso activo durante el scroll');
  else if (m.maxDesfasaje > 1)
    fail.push(`pin en movimiento: el paso llegó a desfasarse ${m.maxDesfasaje} posiciones`);
  else if (m.desfasajes / m.muestras > 0.35)
    fail.push(
      `pin en movimiento: ${m.desfasajes} de ${m.muestras} muestras desfasadas (${Math.round((m.desfasajes / m.muestras) * 100)}%) — el paso activo va sistemáticamente atrás del scroll`,
    );
}
if (navTrasPin.length === 0)
  fail.push('el IntersectionObserver del navbar dejó de marcar sección después del pin');

if (allConsoleErrors.length) fail.push(`${allConsoleErrors.length} errores de consola`);

console.log("");
if (fail.length) {
  console.error(`FALLA:\n  ${fail.join("\n  ")}`);
  process.exit(1);
}
console.error(
  "OK — scroll nativo, IO y useScroll intactos, anclas compensadas por los tres caminos, y sin inercia bajo reduced-motion.",
);
