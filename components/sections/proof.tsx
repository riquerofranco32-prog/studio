import { Zap, Users2, Code2, ShieldCheck } from "lucide-react";
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

const pillars = [
  {
    icon: Zap,
    title: "Velocidad & Craft Senior",
    description:
      "Iteramos rápido sin sacrificar la calidad visual ni la arquitectura técnica. Tu producto sale a producción en semanas, no meses.",
  },
  {
    icon: Users2,
    title: "0 Intermediarios",
    description:
      "Hablás directamente con nosotros. Sin project managers traduciendo mensajes ni briefs que se distorsionan en el camino.",
  },
  {
    icon: Code2,
    title: "Arquitectura Moderna",
    description:
      "Construimos sobre Next.js, React 19, TypeScript y Tailwind v4. Interfaces ultrarrápidas, accesibles y optimizadas para SEO.",
  },
  {
    icon: ShieldCheck,
    title: "Compromiso de Calidad",
    description:
      "Garantía post-lanzamiento, código documentado y escalabilidad asegurada desde el primer commit.",
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

      <Container className="mt-20">
        {/* Estadísticas en tarjetas glass */}
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Pilares diferenciales de Se7en */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center">
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              Por qué elegir Se7en Studio
            </p>
            <h2 className="display mt-3 text-3xl text-foreground md:text-4xl">
              El diferencial de trabajar con un estudio boutique.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-border/80 bg-surface/50 p-6 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
