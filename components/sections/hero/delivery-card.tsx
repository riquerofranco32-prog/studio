"use client";

import { useEffect, useState } from "react";
import { Check, Code2, Gauge, Globe, Lock, type LucideIcon } from "lucide-react";

type Timing = { ttfb: number; fcp: number };

// Tarjeta del hero: un mini panel de deploy. Las dos métricas de arriba son
// reales, medidas en el navegador de quien mira esta misma página:
//  - Respuesta del servidor: TTFB (Navigation Timing).
//  - Primer contenido visible: FCP (Paint Timing), lo que tarda en aparecer
//    algo en pantalla. Es lo que se siente como "carga"; la duración total de
//    la navegación suma recursos diferidos (3D, videos) que no se ven antes.
// Cada barra muestra el valor contra el umbral "bueno" de web.dev. Abajo, los
// compromisos que ya sostenemos en cada entrega (Proceso y stack).

const METRICS = [
  { key: "ttfb", label: "Respuesta del servidor", short: "Servidor", good: 800 },
  { key: "fcp", label: "Primer contenido visible", short: "Primer render", good: 1800 },
] as const;

const PROMISES: { icon: LucideIcon; label: string; detail: string }[] = [
  { icon: Globe, label: "Deploy en Vercel", detail: "CDN global" },
  { icon: Lock, label: "Dominio propio + SSL", detail: "HTTPS" },
  { icon: Gauge, label: "Lighthouse al entregar", detail: "90+" },
  { icon: Code2, label: "Código 100% tuyo", detail: "repo propio" },
];

/** Cuenta desde 0 hasta `to` con una curva suave; null mientras no hay dato. */
function useCountUp(to: number | null, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (to == null) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

function Metric({ label, short, value, good }: { label: string; short: string; value: number | null; good: number }) {
  const shown = useCountUp(value);
  const ok = value != null && value <= good;
  // La barra va de 0 a 2× el umbral: la marca del medio es el límite "bueno".
  const pct = value == null ? 0 : Math.min(100, (value / (good * 2)) * 100);
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3.5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{label}</span>
      </p>
      <p className="mt-2 flex items-baseline gap-1 font-mono tabular-nums">
        <span className="text-3xl leading-none text-foreground">{value == null ? "—" : shown}</span>
        <span className="text-xs text-muted">ms</span>
      </p>
      <div className="relative mt-3 h-1 rounded-full bg-border">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000 ease-out ${ok ? "bg-emerald-400" : "bg-amber-400"}`}
          style={{ width: `${pct}%` }}
        />
        <span aria-hidden className="absolute top-1/2 left-1/2 h-2.5 w-px -translate-y-1/2 bg-muted/60" />
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted">
        {value == null ? "midiendo…" : ok ? (
          <span className="text-emerald-400">bueno</span>
        ) : (
          <span className="text-amber-400">mejorable</span>
        )}
        <span className="hidden text-muted/70 sm:inline"> · umbral {good} ms</span>
      </p>
    </div>
  );
}

export function DeliveryCard() {
  const [timing, setTiming] = useState<Timing | null>(null);

  useEffect(() => {
    function measure() {
      const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const [paint] = performance.getEntriesByName("first-contentful-paint");
      if (!nav) return;
      setTiming({
        ttfb: Math.max(1, Math.round(nav.responseStart - nav.requestStart)),
        fcp: Math.max(1, Math.round(paint ? paint.startTime : nav.domContentLoadedEventEnd)),
      });
    }

    if (document.readyState === "complete") {
      measure();
      return;
    }
    const onLoad = () => setTimeout(measure, 0);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute -top-px -left-px h-5 w-5 rounded-tl-2xl border-t border-l border-accent/50"
      />
      <span
        aria-hidden
        className="absolute -right-px -bottom-px h-5 w-5 rounded-br-2xl border-r border-b border-accent/50"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-[0_30px_80px_-40px_rgba(255,77,46,0.35)] backdrop-blur-md">
        {/* Barra de ventana con el estado del deploy. */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 font-mono text-[11px]">
          <span className="flex min-w-0 items-center gap-2 text-muted">
            <span aria-hidden className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
            </span>
            <span className="truncate">tuproyecto.com.ar</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Producción · listo
          </span>
        </div>

        {/* Métricas en vivo. */}
        <div className="grid grid-cols-2 gap-2.5 p-3.5">
          {METRICS.map((m) => (
            <Metric key={m.key} label={m.label} short={m.short} good={m.good} value={timing ? timing[m.key] : null} />
          ))}
        </div>

        {/* Lo que incluye cada entrega. */}
        <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 border-t border-border px-4 py-4 sm:grid-cols-2">
          {PROMISES.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 text-accent">
                <Icon size={14} strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] leading-tight text-foreground">{label}</span>
                <span className="block font-mono text-[10px] text-muted">{detail}</span>
              </span>
              <Check aria-hidden size={14} className="ml-auto shrink-0 text-emerald-400" />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted">
          <span>medido en vivo, en tu navegador</span>
          <span className="text-accent">se7en studio</span>
        </div>
      </div>
    </div>
  );
}
