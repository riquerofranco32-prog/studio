/**
 * Verificación óptica medida de la landing.
 *
 *   npm run visual-check                      (contra http://localhost:3000)
 *   npm run visual-check -- https://tu-url    (contra un deploy)
 *
 * Levanta Chrome headless, recorre la página en cuatro breakpoints y reporta
 * números, no impresiones: tamaños tipográficos y colores computados, overflow
 * horizontal y texto recortado por ancestros con `overflow: hidden`. Guarda las
 * capturas en `.visual-check/` (ignorado por git).
 *
 * Usa el Chrome que ya cachea Puppeteer en la máquina. Si no existe, correr:
 *   npx puppeteer browsers install chrome
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";
const OUT = ".visual-check";

const BREAKPOINTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "laptop", width: 1280, height: 800 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 },
];

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

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));

const report = {};

for (const { label, width, height } of BREAKPOINTS) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

  // Esperar a la tipografía, no a un reloj. Las métricas de texto cambian
  // cuando termina el font-swap, y medir antes daba solapamientos fantasma:
  // contra producción apareció uno en 1 de 5 corridas que no se reproducía,
  // porque por red el swap cae más tarde que en localhost y el timeout fijo
  // de 2s a veces no alcanzaba. document.fonts.ready es la señal exacta.
  // Un test que falla 1 de 5 se termina ignorando, y acá el detector de
  // solapamientos ya encontró tres bugs reales.
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  // Lo único que queda por esperar después de las fuentes son los reveals por
  // viewport, que son de duración conocida: 0.55s el de las tarjetas más 90ms
  // de cascada (ver --dur-base y --stagger en globals.css).
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(async () => {
    // scroll-behavior: smooth dejaría el scroll a mitad de camino al capturar.
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 900));

  await page.screenshot({ path: `${OUT}/${label}-fold.png` });
  await page.screenshot({ path: `${OUT}/${label}-full.png`, fullPage: true });

  report[label] = await page.evaluate((vw) => {
    const computed = (sel, props) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, s.getPropertyValue(p)]));
    };

    const clippedByAncestor = (el) => {
      let p = el.parentElement;
      while (p && p !== document.documentElement) {
        const s = getComputedStyle(p);
        // `auto`/`scroll` cuentan como contenidos: son scrollers horizontales
        // intencionales (la lista de pasos del proceso en mobile, por ejemplo).
        if (s.overflowX !== "visible") return true;
        p = p.parentElement;
      }
      return false;
    };

    const clipped = [];
    for (const el of document.querySelectorAll("h1,h2,h3,p,span,li,a,button")) {
      const parent = el.parentElement;
      if (!parent || parent.className.toString().includes("marquee")) continue;
      const ps = getComputedStyle(parent);
      if (ps.overflow !== "hidden" && ps.overflowX !== "hidden") continue;
      if (el.getBoundingClientRect().width > parent.clientWidth + 1) {
        clipped.push({
          text: el.textContent.trim().slice(0, 40),
          elW: Math.round(el.getBoundingClientRect().width),
          parentW: parent.clientWidth,
        });
      }
    }

    // Solapamiento entre bloques de texto. El sello circular del hero pisó el
    // párrafo del subtítulo durante semanas en producción, a 1024/1280/1440, y
    // este script pasaba limpio: miraba texto más ancho que un ancestro con
    // overflow:hidden y desbordes del borde derecho, pero nunca dos elementos
    // encima del otro. Esto cubre ese hueco.
    // Recorte VERTICAL de la tinta. El detector de `clipped` de abajo compara
    // anchos, así que no veía este caso: un ancestro con overflow:hidden cuya
    // caja es más baja que la tinta de la fuente le come la panza a p, g, q e y.
    // Pasó desapercibido en producción en el titular del hero — 18px comidos a
    // 104px de fuente — porque los cuatro breakpoints daban limpio.
    const sheared = [];
    {
      const rango = document.createRange();
      for (const el of document.querySelectorAll("h1,h2,h3,p,span,a,li,dd")) {
        if (!el.textContent.trim()) continue;
        // Sólo interesa el ancestro que realmente recorta.
        let clipper = el.parentElement;
        while (clipper && clipper !== document.documentElement) {
          const st = getComputedStyle(clipper);
          if (st.overflow === "hidden" || st.overflowY === "hidden") break;
          clipper = clipper.parentElement;
        }
        if (!clipper || clipper === document.documentElement) continue;
        // El wordmark del footer se recorta a propósito: sangra por abajo.
        if (clipper.closest("footer")) continue;

        rango.selectNodeContents(el);
        const rects = [...rango.getClientRects()];
        if (!rects.length) continue;
        const inkBottom = Math.max(...rects.map((r) => r.bottom));
        const caja = clipper.getBoundingClientRect().bottom;
        // 1.5px de tolerancia: el redondeo subpíxel no es un recorte.
        const comido = inkBottom - caja;
        if (comido > 1.5) {
          sheared.push({
            texto: el.textContent.trim().slice(0, 30),
            px: Math.round(comido),
            fontSize: getComputedStyle(el).fontSize,
          });
        }
      }
    }

    const overlapping = [];
    {
      const legibles = [...document.querySelectorAll("p,h1,h2,h3,li,dd,dt")].filter(
        (el) => {
          const r = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          return (
            r.width > 24 &&
            r.height > 8 &&
            st.visibility !== "hidden" &&
            st.opacity !== "0" &&
            el.textContent.trim().length > 0
          );
        },
      );
      const solapa = (a, b) => {
        const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        // 4px de tolerancia: los descendientes tipográficos se rozan de más.
        return x > 4 && y > 4 ? { x: Math.round(x), y: Math.round(y) } : null;
      };
      for (let i = 0; i < legibles.length; i++) {
        for (let j = i + 1; j < legibles.length; j++) {
          const a = legibles[i];
          const b = legibles[j];
          // Anidados o hermanos de la misma caja: su superposición es el flujo
          // normal del documento, no un bug.
          if (a.contains(b) || b.contains(a)) continue;
          const s = solapa(a.getBoundingClientRect(), b.getBoundingClientRect());
          if (!s) continue;
          overlapping.push({
            a: a.textContent.trim().slice(0, 32),
            b: b.textContent.trim().slice(0, 32),
            px: `${s.x}x${s.y}`,
          });
        }
      }
    }

    const overflowing = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right <= vw + 1 || r.width === 0 || r.height === 0) continue;
      if (clippedByAncestor(el)) continue;
      overflowing.push({
        sel:
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          (typeof el.className === "string" && el.className
            ? `.${el.className.split(" ").slice(0, 4).join(".")}`
            : ""),
        right: Math.round(r.right),
      });
    }

    return {
      docHeight: document.body.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: vw,
      h1: computed("h1", [
        "font-family",
        "font-size",
        "font-weight",
        "letter-spacing",
        "line-height",
      ]),
      accent: computed("h1 .text-accent", ["color"]),
      body: computed("body", ["background-color", "color", "font-family"]),
      clipped,
      sheared: sheared.slice(0, 8),
      overlapping: overlapping.slice(0, 8),
      overflowing: overflowing.slice(0, 8),
    };
  }, width);
}

await browser.close();

console.log(JSON.stringify({ url: URL, consoleErrors, report }, null, 2));

const failures = [
  consoleErrors.length && `${consoleErrors.length} errores de consola`,
  ...BREAKPOINTS.map(({ label }) => {
    const r = report[label];
    if (r.scrollWidth > r.viewportWidth + 1)
      return `${label}: overflow horizontal (${r.scrollWidth}px)`;
    if (r.clipped.length) return `${label}: ${r.clipped.length} texto(s) recortado(s)`;
    if (r.sheared.length)
      return `${label}: ${r.sheared.length} texto(s) con la tinta recortada por abajo — p.ej. "${r.sheared[0].texto}" pierde ${r.sheared[0].px}px a ${r.sheared[0].fontSize}`;
    if (r.overlapping.length)
      return `${label}: ${r.overlapping.length} solapamiento(s) de texto — p.ej. "${r.overlapping[0].a}" sobre "${r.overlapping[0].b}" (${r.overlapping[0].px}px)`;
    return null;
  }),
].filter(Boolean);

if (failures.length) {
  console.error(`\nFALLA:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.error(`\nOK — ${BREAKPOINTS.length} breakpoints limpios. Capturas en ${OUT}/`);
