"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFooterInView } from "@/components/ui/floating-status-bar";

// En el mismo orden que app/page.tsx: la numeración 01…07 tiene que coincidir
// con lo que se ve al scrollear.
export const SECTIONS = [
  { id: "hero", label: "Inicio" },
  { id: "work", label: "Trabajo" },
  { id: "services", label: "Servicios" },
  { id: "process", label: "Proceso" },
  { id: "about", label: "Nosotros" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contacto" },
];

// Línea de lectura, como fracción del alto del viewport.
const READING_LINE = 0.4;

/**
 * Sección activa de la home. Es la primera cuyo borde inferior todavía está
 * por debajo de la línea de lectura. Un IntersectionObserver sobre una banda
 * fina fallaba: cuando la banda cae en una sección sin ancla (WorkWall, Proof,
 * el footer) no llega ningún evento y queda activa la última sección vista.
 * Medir por posición nunca se traba: el bloque sin ancla cuenta como la
 * sección que viene después, y el footer como la última.
 */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    function update() {
      raf = 0;
      const line = window.innerHeight * READING_LINE;
      const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
        (el): el is HTMLElement => el !== null,
      );
      const current =
        els.find((el) => el.getBoundingClientRect().bottom > line) ??
        els.at(-1);
      if (current) setActive(current.id);
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled]);

  return active;
}

export function SideNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  // El footer ocupa todo el ancho y su columna izquierda cae bajo los puntos.
  const footerInView = useFooterInView();

  // Solo tiene sentido en la home: es la única página con las secciones ancladas.
  if (!isHome) return null;

  // Desde 1440px: por debajo el margen del Container (px-10) es más angosto que
  // la columna de puntos y la pisaría. El nombre sólo aparece en hover/foco
  // por lo mismo; la sección activa se marca con el punto en acento.
  return (
    <nav
      aria-label="Navegación de sección"
      inert={footerInView}
      className={`fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-300 min-[1440px]:flex ${
        footerInView ? "pointer-events-none opacity-0" : ""
      }`}
    >
      {SECTIONS.map((item, i) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "true" : undefined}
            className={`focus-ring group flex items-center gap-2.5 transition-colors ${
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition-colors ${
                isActive
                  ? "border-accent bg-accent text-background"
                  : "border-border bg-surface/80 group-hover:border-foreground/30"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-background/80 text-xs font-medium tracking-wide opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:max-w-[6rem] group-hover:px-2 group-hover:py-0.5 group-hover:opacity-100 group-focus-visible:max-w-[6rem] group-focus-visible:px-2 group-focus-visible:py-0.5 group-focus-visible:opacity-100">
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
