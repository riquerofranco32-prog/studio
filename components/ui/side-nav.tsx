"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ITEMS = [
  { id: "hero", label: "Inicio" },
  { id: "work", label: "Trabajo" },
  { id: "about", label: "Nosotros" },
  { id: "services", label: "Servicios" },
  { id: "contact", label: "Contacto" },
];

export function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState(ITEMS[0].id);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Solo tiene sentido en la home: es la única página con las 5 secciones ancladas.
  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="Navegación de sección"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {ITEMS.map((item, i) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
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
            <span
              className={`overflow-hidden text-xs font-medium tracking-wide transition-all duration-300 ${
                isActive
                  ? "max-w-[6rem] opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-[6rem] group-hover:opacity-100"
              }`}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
