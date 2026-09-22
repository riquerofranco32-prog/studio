"use client";

import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { CountUp } from "@/components/ui/count-up";
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";

const keyStats = [
  { value: `${projects.length}`, label: "Proyectos entregados" },
  { value: "100%", label: "Velocidad & SEO" },
  { value: SITE.stats.people, label: "Fundadores directos" },
  { value: "24h", label: "Tiempo de respuesta" },
];

export function Proof() {
  const brands = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section className="border-t border-border py-16 md:py-20">
      <Container>
        <p className="text-center font-mono text-xs tracking-widest text-muted uppercase">
          Marcas y productos que diseñamos, programamos y escalamos
        </p>
      </Container>

      {/* Marquee de marcas y proyectos */}
      <div className="mt-6 border-y border-border py-4 bg-surface/30">
        <Marquee duration={35}>
          {brands.map((project) => (
            <span
              key={project.slug}
              className="flex items-center gap-8 pr-8 text-xl font-medium tracking-tight text-muted transition-colors hover:text-foreground md:text-2xl"
            >
              <span>{project.name}</span>
              <span className="font-mono text-xs text-accent">
                [{project.category.split("/")[0].trim()}]
              </span>
              <span aria-hidden className="text-accent/40 text-xs">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container className="mt-14">
        {/* Fila editorial de métricas: número gigante, sin chrome de card. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 lg:grid-cols-4">
          {keyStats.map((stat) => (
            <div key={stat.label}>
              <span className="display block text-5xl text-foreground md:text-6xl">
                <CountUp value={stat.value} />
              </span>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
