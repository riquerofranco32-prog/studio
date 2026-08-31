"use client";

import { Zap, Users2, Code2, Gauge, CheckCircle2, Terminal } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { CountUp } from "@/components/ui/count-up";
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";

const keyStats = [
  {
    value: `${projects.length}`,
    label: "Productos Shipped",
    detail: "SaaS, E-Commerce y Web",
    icon: Zap,
  },
  {
    value: "100%",
    label: "Lighthouse & SEO",
    detail: "Core Web Vitals óptimos",
    icon: Gauge,
  },
  {
    value: SITE.stats.people,
    label: "Fundadores Directos",
    detail: "Cero intermediarios",
    icon: Users2,
  },
  {
    value: "0%",
    label: "Deuda Técnica",
    detail: "Next.js 16 + TypeScript",
    icon: Code2,
  },
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
              <span className="font-mono text-xs text-accent">[{project.category.split("/")[0].trim()}]</span>
              <span aria-hidden className="text-accent/40 text-xs">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container className="mt-14">
        {/* Strip compacto de 4 métricas clave */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {keyStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {stat.label}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform group-hover:scale-110">
                    <Icon size={14} />
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="display text-3xl font-bold text-foreground md:text-4xl">
                    <CountUp value={stat.value} />
                  </span>
                </div>

                <p className="mt-1 font-mono text-[11px] text-muted">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
