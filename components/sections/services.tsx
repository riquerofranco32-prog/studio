import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Servicios & Capacidades"
          title="De la idea a la interfaz."
          subtitle="Cuatro modalidades de trabajo diseñadas para impulsar el crecimiento de tu producto digital."
        />

        <div className="mt-16 border-t border-border">
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative grid grid-cols-1 gap-6 border-b border-border py-10 transition-all duration-500 hover:bg-surface/60 md:grid-cols-12 md:items-baseline md:gap-10 md:py-14"
            >
              {/* Filete de acento que crece al hacer hover sobre la fila */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
              />

              <div className="flex items-center gap-3 md:col-span-1">
                <span className="font-mono text-sm text-muted transition-colors duration-300 group-hover:text-accent">
                  {service.number}
                </span>
              </div>

              <div className="md:col-span-5">
                {service.tagline && (
                  <p className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
                    {service.tagline}
                  </p>
                )}
                <h3 className="display text-3xl text-foreground transition-transform duration-500 group-hover:translate-x-1 md:text-[2.75rem]">
                  {service.title}
                </h3>
              </div>

              <div className="md:col-span-5">
                <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">
                  {service.description}
                </p>
                {service.deliverables && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors duration-300 group-hover:border-accent/30 group-hover:text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="hidden justify-end md:col-span-1 md:flex">
                <a
                  href={`/#contact`}
                  aria-label={`Consultar por ${service.title}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-background"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
