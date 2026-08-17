/**
 * Peso real de los chunks JS que baja cada ruta.
 *
 *   npm run bundle-size                 (reporte)
 *   npm run bundle-size -- --save       (además guarda la medición como línea de base)
 *
 * Next 16 dejó de imprimir el peso por ruta en `next build`, así que el número
 * hay que sacarlo del build. Este script parsea el HTML prerenderizado de cada
 * ruta, junta los chunks que realmente referencia y los gzipea — que es lo que
 * viaja por la red, no el tamaño en disco.
 *
 * Correr SIEMPRE después de `npm run build`: lee de `.next/`, no compila nada.
 *
 * La línea de base se guarda en `.bundle-size.json` (ignorado por git) para que
 * cada quien compare contra su propia medición y no contra un número pegado en
 * un doc que envejece.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const APP_DIR = ".next/server/app";
const BASELINE = ".bundle-size.json";
const save = process.argv.includes("--save");

if (!existsSync(APP_DIR)) {
  console.error(`No existe ${APP_DIR}. Correr \`npm run build\` primero.`);
  process.exit(1);
}

/** Todos los .html prerenderizados, incluidos los de rutas dinámicas. */
function htmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(p, acc);
    else if (entry.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

/**
 * Los chunks que referencia un HTML. Set porque el mismo chunk aparece varias
 * veces entre <script> y los preloads.
 */
function chunksOf(htmlPath) {
  const html = readFileSync(htmlPath, "utf8");
  const found = new Set();
  for (const m of html.matchAll(/\/_next\/(static\/chunks\/[A-Za-z0-9_.\-]+\.js)/g)) {
    found.add(m[1]);
  }
  return [...found];
}

function weigh(files) {
  let raw = 0;
  let gzip = 0;
  for (const f of files) {
    const buf = readFileSync(join(".next", f));
    raw += buf.length;
    // level 9: los CDN comprimen cerca de esto, y deja el número estable
    // entre corridas en vez de depender del default de zlib.
    gzip += gzipSync(buf, { level: 9 }).length;
  }
  return { raw, gzip, count: files.length };
}

const kb = (n) => (n / 1024).toFixed(1);

const routes = {};
for (const file of htmlFiles(APP_DIR)) {
  // .next/server/app/work/takefyy.html → /work/takefyy
  const route = "/" + file.slice(APP_DIR.length + 1, -".html".length).replace(/\\/g, "/");
  routes[route === "/index" ? "/" : route] = weigh(chunksOf(file));
}

// El CSS no está en el HTML como chunk de JS pero sí bloquea el render.
let css = { raw: 0, gzip: 0, count: 0 };
function walkCss(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkCss(p);
    else if (entry.name.endsWith(".css")) {
      const buf = readFileSync(p);
      css = { raw: css.raw + buf.length, gzip: css.gzip + gzipSync(buf, { level: 9 }).length, count: css.count + 1 };
    }
  }
}
walkCss(".next/static");

const previous = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;

const rows = Object.entries(routes).sort((a, b) => b[1].gzip - a[1].gzip);
console.log("\nRuta                        chunks      raw        gzip     vs base");
console.log("─".repeat(72));
for (const [route, r] of rows) {
  const before = previous?.routes?.[route];
  const delta = before ? `  ${r.gzip >= before.gzip ? "+" : ""}${kb(r.gzip - before.gzip)} KB` : "  —";
  console.log(
    `${route.padEnd(26)}${String(r.count).padStart(4)}  ${kb(r.raw).padStart(9)} KB  ${kb(r.gzip).padStart(7)} KB${delta}`,
  );
}
const cssDelta = previous?.css ? `  ${css.gzip >= previous.css.gzip ? "+" : ""}${kb(css.gzip - previous.css.gzip)} KB` : "  —";
console.log("─".repeat(72));
console.log(`${"CSS".padEnd(26)}${String(css.count).padStart(4)}  ${kb(css.raw).padStart(9)} KB  ${kb(css.gzip).padStart(7)} KB${cssDelta}`);

if (previous) {
  console.log(`\nLínea de base: ${previous.takenAt}`);
} else {
  console.log(`\nSin línea de base guardada. Correr con --save para fijar la actual.`);
}

if (save) {
  writeFileSync(BASELINE, JSON.stringify({ takenAt: new Date().toISOString(), routes, css }, null, 2) + "\n");
  console.log(`Línea de base guardada en ${BASELINE}`);
}
