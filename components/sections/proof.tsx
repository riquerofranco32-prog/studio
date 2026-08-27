"use client";

import { Zap, Users2, Code2, Gauge, CheckCircle2, MessageSquare, Terminal } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { CountUp } from "@/components/ui/count-up";
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";

const stats = [
  {
    value: `${projects.length}`,
    label: "Productos en producción",
    description: "SaaS, E-Commerce y plataformas web",
  },
  {
    value: SITE.stats.people,
    label: "Fundadores directos",
    description: "Diseño y desarrollo sin intermediarios",
  },
  {
    value: SITE.stats.years,
    label: "Años construyendo",
    description: "Evolución constante de productos",
  },
  {
    value: "100%",
    label: "Diseño y código propios",
    description: "Sin plantillas prearmadas ni wrappers",
  },
];

export function Proof() {
  const brands = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container>
        <p className="text-center font-mono text-xs tracking-widest text-muted uppercase">
          Marcas y productos que diseñamos y construimos
        </p>
      </Container>

      {/* Marquee de marcas */}
      <div className="mt-8 border-y border-border py-6 bg-surface/30">
        <Marquee duration={35}>
          {brands.map((project) => (
            <span
              key={project.slug}
              className="flex items-center gap-8 pr-8 text-2xl font-medium tracking-tight text-muted transition-colors hover:text-foreground md:text-3xl"
            >
              <span>{project.name}</span>
              <span className="font-mono text-xs text-accent">[{project.category.split("/")[0].trim()}]</span>
              <span aria-hidden className="text-accent/40 text-sm">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container className="mt-24">
        {/* Encabezado de Craft & Diferencial */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">
            Estudio Boutique de Craft & Ingeniería
          </p>
          <h2 className="display mt-3 text-3xl text-foreground sm:text-4xl md:text-5xl">
            Construido para velocidad, conversión y cero deuda técnica.
          </h2>
          <p className="mt-4 text-base text-muted md:text-lg">
            La agilidad de dos fundadores senior combinada con los estándares de ingeniería de productos globales.
          </p>
        </div>

        {/* Bento Grid de Alto Impacto */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Card 1: 100/100 Lighthouse & Core Web Vitals (Grande, 7 cols) */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:col-span-7">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Gauge size={20} />
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
                100 / 100 Lighthouse
              </span>
            </div>

            <h3 className="display mt-6 text-2xl text-foreground md:text-3xl">
              Velocidad instantánea. Cero fricción de carga.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              Optimizamos cada byte sirviendo imágenes en AVIF, fuentes locales precargadas y renderizado en el borde. Reducimos el rebote e incrementamos tu tasa de conversión.
            </p>

            {/* Scoreboard visual de métricas de rendimiento */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-center">
                <span className="font-mono text-xl font-bold text-emerald-400">100</span>
                <span className="mt-1 block font-mono text-[10px] uppercase text-muted">Performance</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-center">
                <span className="font-mono text-xl font-bold text-emerald-400">100</span>
                <span className="mt-1 block font-mono text-[10px] uppercase text-muted">Accessibility</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-center">
                <span className="font-mono text-xl font-bold text-emerald-400">&lt; 50ms</span>
                <span className="mt-1 block font-mono text-[10px] uppercase text-muted">TTFB Edge</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-3 text-center">
                <span className="font-mono text-xl font-bold text-emerald-400">0.3s</span>
                <span className="mt-1 block font-mono text-[10px] uppercase text-muted">FCP Instant</span>
              </div>
            </div>
          </div>

          {/* Card 2: 0 Intermediarios · Fundadores Directos (5 cols) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Users2 size={20} />
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                  Canal Directo
                </span>
              </div>

              <h3 className="display mt-6 text-2xl text-foreground">
                Cero intermediarios.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Hablás directamente con Franco y Mateo. Sin project managers traduciendo mensajes ni briefs que se distorsionan en el camino.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-border/80 bg-background/80 p-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-muted">
                <MessageSquare size={14} className="text-emerald-400" />
                <span>Canal dedicado Slack / WhatsApp</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                <span className="text-muted">Tiempo de respuesta:</span>
                <span className="text-emerald-400 font-semibold">&lt; 2 horas hábiles</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sprint Velocity 2 a 4 semanas (5 cols) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Zap size={20} />
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
                  Time-to-Market
                </span>
              </div>

              <h3 className="display mt-6 text-2xl text-foreground">
                De 0 a producción en 2 a 4 semanas.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Iteraciones rápidas y entregas continuas en staging para que veas el progreso de tu producto día a día, sin esperas de meses.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-border/80 pt-4 text-xs font-mono text-muted">
              <CheckCircle2 size={16} className="text-accent" />
              <span>Garantía y soporte post-lanzamiento</span>
            </div>
          </div>

          {/* Card 4: Código & Arquitectura Moderna (Grande, 7 cols) */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:col-span-7">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Code2 size={20} />
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
                Propiedad 100% Tuya
              </span>
            </div>

            <h3 className="display mt-6 text-2xl text-foreground md:text-3xl">
              Arquitectura moderna. 100% código limpio.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              Sin plantillas infladas de WordPress ni constructores lentos. Tu producto vive en un repositorio de GitHub bajo tu control, con TypeScript y estándares de primer nivel.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js 16 (Turbopack)", "React 19 Server Actions", "Tailwind CSS v4", "TypeScript Strict", "Supabase Postgres", "Framer Motion"].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1 font-mono text-xs text-muted transition-colors group-hover:border-accent/30 group-hover:text-foreground"
                >
                  <Terminal size={12} className="text-accent" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas y números clave en fila */}
        <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-accent/30 hover:bg-surface-2"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="display block text-5xl text-foreground md:text-6xl">
                  <CountUp value={stat.value} />
                </span>
                <span className="mt-3 block font-mono text-xs uppercase tracking-wider text-accent">
                  {stat.label}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {stat.description}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
