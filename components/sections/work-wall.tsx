"use client";

import { Reveal } from "@/components/ui/reveal";
import { RevealText } from "@/components/ui/reveal-text";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { capabilities } from "@/data/services";
import { projects } from "@/data/projects";
import { team } from "@/data/team";

// Cierre del Hero, estilo John Moore: titular + tags de capacidades, y un
// collage de trabajo real que se acerca con el scroll. Puente hacia
// "Trabajo seleccionado". El septimo elemento es un fundador — el trabajo
// y la gente detrás, en el mismo gesto.
const collageImages = [
  ...[...projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
    .map((p) => ({ src: p.image, alt: p.name, href: `/work/${p.slug}` })),
  { src: team[0].imageUrl ?? "", alt: team[0].name ?? "Se7en Studio" },
];

export function WorkWall() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="display text-3xl text-foreground sm:text-4xl md:text-5xl">
          <span className="line-mask block">
            <RevealText>Así construimos.</RevealText>
          </span>
        </h2>
        <Reveal
          index={1}
          className="mt-6 flex flex-wrap justify-center gap-2.5"
        >
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-foreground"
            >
              {cap}
            </span>
          ))}
        </Reveal>
      </div>

      <div className="mt-16">
        <ZoomParallax images={collageImages} />
      </div>
    </section>
  );
}
