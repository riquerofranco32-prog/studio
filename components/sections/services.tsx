import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { ButtonLink } from "@/components/ui/button-link";
import { services } from "@/data/services";

// Ancla de cada servicio en /services (ids de `detailedServices` en
// app/services/page.tsx). ponytail: mapa por número; si cambia el orden o se
// suma un servicio, actualizar acá.
const anchors: Record<string, string> = {
  "01": "landing",
  "02": "ecommerce",
  "03": "saas",
  "04": "ai",
};

export function Services() {
  return (
    <section id="services" className="border-t border-border py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
            <span className="text-accent">●</span> Servicios
          </p>
          <h2 className="display text-4xl uppercase text-foreground md:text-6xl">
            <RevealText>Qué hacemos</RevealText>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Cuatro formas de trabajar juntos. Alcance claro desde el día uno y
            sin sorpresas en el camino.
          </p>
        </div>

        <div className="mt-12 border-t border-border md:mt-16">
          {services.map((service) => (
            // Toda la fila es clickeable con el patrón de "stretched link": el
            // <a> vive en el título (nombre accesible corto) y su ::after cubre
            // la fila entera.
            <article
              key={service.number}
              className="group relative isolate grid grid-cols-1 gap-5 border-b border-border py-10 before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-surface/60 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:before:opacity-100 focus-within:before:opacity-100 md:grid-cols-12 md:items-baseline md:gap-10 md:py-12 md:before:-inset-x-6"
            >
              {/* Filete de acento que crece al hacer hover sobre la fila */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full group-focus-within:w-full"
              />

              <span className="font-mono text-sm text-muted transition-colors duration-300 group-hover:text-accent md:col-span-1">
                {service.number}
              </span>

              <div className="md:col-span-5">
                {service.tagline && (
                  <p className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
                    {service.tagline}
                  </p>
                )}
                <h3 className="display text-3xl text-foreground lg:text-[2.75rem]">
                  <Link
                    href={`/services#${anchors[service.number] ?? ""}`}
                    className="focus-ring rounded-sm after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="inline-block transition-transform duration-500 motion-safe:group-hover:translate-x-1">
                      {service.title}
                    </span>
                  </Link>
                </h3>
              </div>

              <div className="md:col-span-5">
                <p className="max-w-md text-base leading-relaxed text-muted">
                  {service.description}
                </p>
                {service.deliverables && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] tracking-wide text-foreground/80 transition-colors duration-300 group-hover:border-accent/30"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-9 flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background md:static md:col-span-1 md:justify-self-end"
              >
                <ArrowRight
                  size={18}
                  className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
                />
              </span>
            </article>
          ))}
        </div>

        {/* CTA al configurador de precios */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-base font-semibold text-foreground">
              ¿Querés números antes de hablar?
            </p>
            <p className="mt-1 text-sm text-muted">
              Armá tu proyecto en el configurador y llevate una estimación de
              tiempo y costo al instante.
            </p>
          </div>
          <ButtonLink href="/pricing" className="shrink-0">
            Abrir configurador
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
