/**
 * Test de no-regresión del scroll suave (Lenis).
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
 *   6. los anchors /#work aterrizan con el offset del navbar fijo
 *   7. con prefers-reduced-motion, lerp se fuerza a 1: el scroll sigue al
 *      input 1:1 y no queda inercia
 *
 * Sale con código 1 si algo de eso deja de cumplirse.
 */
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";
/** Alto del navbar fijo scrolleado (h-16) + aire. Espeja anchors.offset del provider. */
const ANCHOR_OFFSET = 80;

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

async function open(preference) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: preference },
  ]);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  return { page, consoleErrors };
}

/**
 * Curva de asentamiento tras un golpe de rueda: cuánto del recorrido total se
 * completó en el primer frame. Es la medida que distingue "suavizado" de
 * "1:1", y sirve para los dos modos.
 */
const SETTLE = async (page) =>
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

// ── Pasada normal ───────────────────────────────────────────────────────────
const { page, consoleErrors } = await open("no-preference");

const settleNormal = await SETTLE(page);

const normal = await page.evaluate(async (offset) => {
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

  // Anchor del navbar: es un <Link href="/#work">, mismo pathname, así que lo
  // toma Lenis y tiene que aplicar el offset del navbar fijo.
  const workLink = [...document.querySelectorAll("header nav a")].find(
    (a) => a.getAttribute("href") === "/#work",
  );
  workLink.click();
  await sleep(2200);
  const work = document.getElementById("work");
  out.anchor = {
    hash: location.hash,
    sectionTop: Math.round(work.getBoundingClientRect().top),
    esperado: offset,
  };

  out.navActive = [...document.querySelectorAll("header nav a")]
    .filter((a) => a.getAttribute("aria-current") === "true")
    .map((a) => a.getAttribute("href"));

  // Reveals por IntersectionObserver: las tarjetas ya vistas deben estar en 1.
  out.cardOpacities = [...document.querySelectorAll('a[href^="/work/"]')]
    .slice(0, 3)
    .map((c) => getComputedStyle(c.closest("[style]") ?? c.parentElement).opacity);

  return out;
}, ANCHOR_OFFSET);

await page.close();

// ── Pasada con reduced-motion ───────────────────────────────────────────────
const { page: page2, consoleErrors: consoleErrors2 } = await open("reduce");

const settleReduced = await SETTLE(page2);

await page2.close();
await browser.close();

const line = "─".repeat(72);
console.log(`\nURL: ${URL}\n`);
console.log(line);
console.log("SCROLL NORMAL (prefers-reduced-motion: no-preference)");
console.log(line);
console.log(`  Lenis activo (html.lenis)          : ${normal.lenisActive}`);
console.log(`  eventos scroll nativos disparados  : ${normal.nativeScrollEvents}`);
console.log(`  window.scrollY tras la rueda       : ${normal.scrollYAfterWheel} px`);
console.log(`  paralaje del hero (useScroll)      : ${normal.gridTransformAt0} → ${normal.gridTransformAfter}`);
console.log(`  navbar en estado scrolleado        : ${normal.headerScrolledStyle}`);
console.log(`  navbar sección activa (IO)         : ${JSON.stringify(normal.navActive)}`);
console.log(`  opacidad de las tarjetas (reveals) : ${JSON.stringify(normal.cardOpacities)}`);
console.log(`  anchor /#work → hash               : ${normal.anchor.hash}`);
console.log(`  anchor /#work → top de la sección  : ${normal.anchor.sectionTop} px (esperado ~${normal.anchor.esperado})`);
console.log(`  errores de consola                 : ${consoleErrors.length}`);
console.log(`  curva de asentamiento              : ${settleNormal.early}px en el 1er frame de ${settleNormal.settled}px totales (${Math.round(settleNormal.ratio * 100)}%)`);
console.log(`\n${line}`);
console.log("REDUCED-MOTION (Lenis fuerza lerp: 1 → el scroll sigue al input 1:1)");
console.log(line);
console.log(`  curva de asentamiento              : ${settleReduced.early}px en el 1er frame de ${settleReduced.settled}px totales (${Math.round(settleReduced.ratio * 100)}%)`);
console.log(`  errores de consola                 : ${consoleErrors2.length}`);

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
if (normal.anchor.hash !== "#work")
  fail.push(`el anchor no dejó el hash en #work (quedó "${normal.anchor.hash}")`);
// Tolerancia de 12px: el navbar cambia de alto al scrollear (h-20 → h-16).
if (Math.abs(normal.anchor.sectionTop - ANCHOR_OFFSET) > 12)
  fail.push(
    `el anchor aterrizó en ${normal.anchor.sectionTop}px, se esperaba ~${ANCHOR_OFFSET}px (navbar fijo tapando la sección)`,
  );
// Las dos caras del mismo hecho, y una hace de control de la otra: si el modo
// normal NO suavizara, la aserción de reduced-motion pasaría por casualidad.
if (settleNormal.ratio > 0.75)
  fail.push(
    `sin reduced-motion el scroll llegó al ${Math.round(settleNormal.ratio * 100)}% en el primer frame: no hay suavizado, Lenis no está interpolando`,
  );
if (settleReduced.ratio < 0.9)
  fail.push(
    `con reduced-motion el scroll llegó sólo al ${Math.round(settleReduced.ratio * 100)}% en el primer frame: debería seguir al input 1:1 (lerp forzado a 1)`,
  );
if (consoleErrors.length)
  fail.push(`${consoleErrors.length} errores de consola en la pasada normal`);
if (consoleErrors2.length)
  fail.push(`${consoleErrors2.length} errores de consola con reduced-motion`);

console.log("");
if (fail.length) {
  console.error(`FALLA:\n  ${fail.join("\n  ")}`);
  process.exit(1);
}
console.error(
  "OK — scroll nativo, IO y useScroll intactos, anchors con offset, y sin inercia bajo reduced-motion.",
);

