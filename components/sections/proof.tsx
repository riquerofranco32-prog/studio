import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";

// Los números salen de la data real del sitio — nada acá está escrito a mano.
const stats = [
  { value: `${projects.length}`, label: "Productos en producción" },
  { value: SITE.stats.people, label: "Personas en el estudio" },
  { value: SITE.stats.years, label: "Construyendo juntos" },
  { value: "100%", label: "Diseño y código propios" },
];

export function Proof() {
  const brands = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section className="border-t border-border py-16 md:py-20">
      <Container>
        <p className="text-center font-mono text-xs tracking-widest text-muted uppercase">
          Marcas y productos que diseñamos y construimos
        </p>
      </Container>

      <div className="mt-10">
        <Marquee duration={38}>
          {brands.map((project) => (
            <span
              key={project.slug}
              className="flex items-center gap-10 pr-10 text-2xl tracking-tight text-muted/70 transition-colors md:text-3xl"
            >
              {project.name}
              <span aria-hidden className="text-accent/50 text-lg">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container>
        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-border pt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="display block text-4xl text-foreground md:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-3 block text-sm text-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
