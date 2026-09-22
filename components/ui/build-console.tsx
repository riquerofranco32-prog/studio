"use client";

import { useEffect, useState } from "react";
import { useMediaQuery, COARSE_POINTER } from "@/lib/use-media-query";

// Visual del hero: un panel que muestra el sitio de prueba real que se
// entrega en el Paso 02 del proceso (ver components/sections/process.tsx).
// Dos líneas son reales, medidas en el momento para quien está mirando esto:
// el tiempo de carga de esta misma página y el tipo de dispositivo detectado.
// El resto son afirmaciones que ya sostenemos en otras secciones (código
// propio, sin errores) en lenguaje llano — nada de jerga técnica.
export function BuildConsole() {
  const [loadMs, setLoadMs] = useState<number | null>(null);
  const isTouch = useMediaQuery(COARSE_POINTER);

  useEffect(() => {
    function measure() {
      const [nav] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (nav) setLoadMs(Math.max(1, Math.round(nav.duration)));
    }

    if (document.readyState === "complete") {
      measure();
    } else {
      window.addEventListener("load", measure);
      return () => window.removeEventListener("load", measure);
    }
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

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            staging.tuproyecto.com
          </div>
          <span className="font-mono text-[10px] text-muted">en vivo</span>
        </div>

        <div className="space-y-2.5 px-4 py-5 font-mono text-[13px] leading-relaxed">
          <p className="text-foreground">
            <span className="text-accent">✓</span> Sitio en línea y funcionando
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Probado a fondo, sin errores
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Tus datos guardados de forma
            segura
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span>{" "}
            {loadMs !== null ? (
              <>
                Esta misma página cargó en{" "}
                <span className="text-accent">{loadMs} ms</span>
              </>
            ) : (
              "Midiendo el tiempo de carga…"
            )}
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Se ve perfecto en tu{" "}
            {isTouch ? "celular" : "computadora"}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[11px] text-muted">
          <span>Tecnología moderna</span>
          <span className="text-accent">El código es 100% tuyo</span>
        </div>
      </div>
    </div>
  );
}
