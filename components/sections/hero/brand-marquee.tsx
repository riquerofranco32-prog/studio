"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { brandFonts } from "@/lib/brand-fonts";
import type { Project } from "@/types";

// Marquesina de proyectos del hero, en dos filas que corren en sentidos
// opuestos:
//  - Arriba, cada proyecto como una "credencial": miniatura del sitio, nombre
//    con la tipografía de su marca y rubro. Al pasar el cursor el nombre toma
//    el color de la marca (y el hero abre la vista previa del clip).
//  - Abajo, los nombres en contorno y gigantes, más lentos: dan escala y
//    movimiento sin competir con la fila de arriba.

function typeOf(p: Project): React.CSSProperties {
  const b = p.brand;
  return {
    fontWeight: b?.weight,
    fontStyle: b?.italic ? "italic" : undefined,
    textTransform: b?.uppercase ? "uppercase" : undefined,
    letterSpacing: b?.tracking != null ? `${b.tracking}em` : undefined,
  };
}

export function BrandMarquee({
  projects,
  onHover,
}: {
  projects: Project[];
  onHover?: (p: Project) => void;
}) {
  return (
    <div className="relative">
      <Marquee duration={40}>
        {projects.map((p) => {
          const accent = p.brand?.accent ?? "#ff4d2e";
          return (
            <span
              key={p.slug}
              onMouseEnter={onHover ? () => onHover(p) : undefined}
              style={{ ["--brand" as string]: accent }}
              className="group/brand mr-4 flex items-center gap-4 rounded-2xl border border-border bg-surface/60 py-2 pr-6 pl-2 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--brand)]/60 md:mr-6"
            >
              <span className="relative h-11 w-[70px] shrink-0 overflow-hidden rounded-xl border border-border md:h-14 md:w-[90px]">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-cover object-top transition-transform duration-500 group-hover/brand:scale-110"
                />
              </span>
              <span className="flex flex-col">
                <span
                  style={typeOf(p)}
                  className={`${p.brand ? brandFonts[p.brand.font] : ""} text-xl leading-none whitespace-nowrap text-foreground transition-colors duration-300 group-hover/brand:text-[var(--brand)] md:text-3xl`}
                >
                  {p.name}
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wide whitespace-nowrap text-muted uppercase">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                  {p.category.split("/")[0].trim()}
                </span>
              </span>
            </span>
          );
        })}
      </Marquee>

      <Marquee duration={70} reverse className="mt-3 md:mt-4">
        {projects.map((p) => (
          <span
            key={p.slug}
            aria-hidden
            className="display flex items-center gap-6 pr-6 text-5xl whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1px_rgba(245,245,244,0.16)] md:gap-10 md:pr-10 md:text-7xl"
          >
            {p.name}
            <span className="text-2xl text-accent/50 [-webkit-text-stroke:0] md:text-3xl">✱</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
