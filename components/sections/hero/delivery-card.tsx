"use client";

import { useEffect, useState } from "react";

type Timing = { ttfb: number; load: number };

// Tarjeta del hero: el checklist con el que se entrega cada sitio. Las dos
// filas con ms son reales, medidas en el navegador de quien mira esta misma
// página (Navigation Timing). El resto son compromisos que ya sostenemos en
// Proceso (dominio + certificado, deploy) y en el stack de cada proyecto.
export function DeliveryCard() {
  const [timing, setTiming] = useState<Timing | null>(null);

  useEffect(() => {
    function measure() {
      const [nav] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (!nav) return;
      setTiming({
        ttfb: Math.max(1, Math.round(nav.responseStart - nav.requestStart)),
        load: Math.max(1, Math.round(nav.duration)),
      });
    }

    // `duration` recién es final después de loadEventEnd: se mide en el
    // tick siguiente al evento load.
    if (document.readyState === "complete") {
      measure();
      return;
    }
    const onLoad = () => setTimeout(measure, 0);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const rows: { label: string; value: string }[] = [
    { label: "Deploy en Vercel", value: "ok" },
    { label: "Dominio propio + SSL", value: "ok" },
    { label: "Lighthouse 90+ al entregar", value: "ok" },
    {
      label: "Respuesta del servidor",
      value: timing ? `${timing.ttfb} ms` : "…",
    },
    {
      label: "Carga de esta página",
      value: timing ? `${timing.load} ms` : "…",
    },
  ];

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

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] text-muted">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            tuproyecto.com.ar
          </span>
          <span>checklist de entrega</span>
        </div>

        <ul className="space-y-2 px-4 py-4 font-mono text-[13px]">
          {rows.map((row) => (
            <li key={row.label} className="flex items-baseline gap-2">
              <span aria-hidden className="text-accent">
                ✓
              </span>
              <span className="text-foreground">{row.label}</span>
              <span
                aria-hidden
                className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-border"
              />
              <span className="text-accent tabular-nums">{row.value}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 font-mono text-[11px] text-muted">
          <span>ms medidos en vivo, en tu navegador</span>
          <span className="text-accent">Código 100% tuyo</span>
        </div>
      </div>
    </div>
  );
}
