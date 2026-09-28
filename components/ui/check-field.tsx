"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSoundFx } from "@/components/providers/sound-provider";

// Palomitas en el fondo de toda la página: grises y apenas visibles; al hacer
// clic (o tocar) cerca de una, se marca en blanco con un pop. Quedan marcadas
// en este navegador.
//
// La capa va detrás del contenido (z negativo), así que no recibe eventos:
// un listener de click en el documento busca la palomita más cercana al
// punto y la marca sólo si está a la vista — nada opaco encima (tarjetas,
// imágenes, la vidriera 3D) — y si el clic no fue sobre algo interactivo.

const STORE = "se7en-checks";
const HIT = 30; // radio de acierto, en px
const HOVER = 90; // radio en que la más cercana se ilumina

type Check = { id: string; x: number; y: number; r: number };

/** PRNG determinista: la misma grilla en cada visita, para poder guardarla. */
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function layout(width: number, height: number): Check[] {
  const mobile = width < 768;
  const cw = mobile ? 118 : 190;
  const ch = mobile ? 150 : 210;
  const cols = Math.max(2, Math.round(width / cw));
  const stepX = width / cols;
  const out: Check[] = [];
  for (let row = 0; row * ch < height; row++) {
    const rnd = rand(row * 7919 + 13);
    for (let col = 0; col < cols; col++) {
      // Algunas celdas quedan vacías: la trama no se ve como una grilla.
      if (rnd() < 0.28) continue;
      out.push({
        id: `${col}-${row}`,
        x: Math.round((col + 0.2 + rnd() * 0.6) * stepX),
        y: Math.round((row + 0.2 + rnd() * 0.6) * ch),
        r: Math.round((rnd() - 0.5) * 24),
      });
    }
  }
  return out;
}

function load(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE) ?? "[]"));
  } catch {
    return new Set();
  }
}

function save(ids: Set<string>) {
  try {
    localStorage.setItem(STORE, JSON.stringify([...ids]));
  } catch {
    // Sin storage (modo privado): funciona igual, sólo no se recuerda.
  }
}

/** ¿Hay algo opaco encima de este punto de la pantalla? */
function covered(cx: number, cy: number) {
  if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return true;
  for (const el of document.elementsFromPoint(cx, cy)) {
    if (el === document.body || el === document.documentElement) return false;
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "IFRAME") return true;
    const cs = getComputedStyle(el);
    if (cs.backgroundImage !== "none") return true;
    const m = cs.backgroundColor.match(/[\d.]+/g);
    const alpha = !m ? 0 : m.length < 4 ? 1 : Number(m[3]);
    if (alpha > 0.4) return true;
  }
  return false;
}

const INTERACTIVE = "a,button,input,textarea,select,label,summary,[role=button],[role=tab],[contenteditable=true],video,canvas";

export function CheckField() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [height, setHeight] = useState(0);
  const [done, setDone] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set() : load(),
  );
  const [fresh, setFresh] = useState<string | null>(null);
  const [near, setNear] = useState<string | null>(null);
  const checksRef = useRef<Check[]>([]);
  const { playPop } = useSoundFx();

  // Grilla según el tamaño del documento; se rehace si cambia.
  useEffect(() => {
    let w = 0;
    let h = 0;
    const update = () => {
      const nw = document.documentElement.clientWidth;
      const nh = document.documentElement.scrollHeight;
      if (nw === w && Math.abs(nh - h) < 40) return;
      w = nw;
      h = nh;
      const next = layout(nw, nh);
      checksRef.current = next;
      setChecks(next);
      setHeight(nh);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const nearest = useCallback((px: number, py: number, radius: number) => {
    let best: Check | null = null;
    let bd = radius * radius;
    for (const c of checksRef.current) {
      const dx = c.x - px;
      const dy = c.y - py;
      const d = dx * dx + dy * dy;
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    return best;
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      const t = e.target as Element | null;
      if (t?.closest(INTERACTIVE)) return;
      if (window.getSelection()?.toString()) return;
      const c = nearest(e.pageX, e.pageY, HIT);
      if (!c || covered(c.x - scrollX, c.y - scrollY)) return;
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(c.id)) next.delete(c.id);
        else next.add(c.id);
        save(next);
        return next;
      });
      setFresh(c.id);
      playPop();
    }

    let raf = 0;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      const { pageX, pageY } = e;
      raf = requestAnimationFrame(() => {
        const c = nearest(pageX, pageY, HOVER);
        setNear(c ? c.id : null);
      });
    }

    document.addEventListener("click", onClick);
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [nearest, playPop]);

  if (!checks.length) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
      style={{ height }}
    >
      {checks.map((c) => {
        const on = done.has(c.id);
        return (
          <span
            key={c.id}
            className={`check-dot ${on ? "is-on" : ""} ${fresh === c.id ? "is-fresh" : ""} ${near === c.id && !on ? "is-near" : ""}`}
            style={{ left: c.x, top: c.y, rotate: `${c.r}deg` }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <circle cx="12" cy="12" r="10.5" className="check-ring" />
              <path d="M7.2 12.4l3.2 3.2 6.4-7" className="check-tick" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
