import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { projects } from "@/data/projects";

// El hero muestra trabajo, no decorados: el titular nombra los proyectos que
// hoy más funcionan y la imagen grande es el primero de ellos. Sin grilla,
// resplandores, pastillas, terminal ni marquesina — todo eso lo tiene
// cualquier landing generada.
const top = [...projects].sort((a, b) => a.order - b.order).slice(0, 4);
const lead = top[0];

function listNames(names: string[]) {
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

export function Hero() {
  return (
    <section id="hero" className="pt-28 pb-20 md:pt-40 md:pb-28">
      <Container>
        <p
          className="hero-rise font-mono text-xs uppercase tracking-widest text-muted"
          style={{ animationDelay: "0.05s" }}
        >
          Estudio de diseño y desarrollo · Patagonia argentina
        </p>

        <h1
          className="hero-rise display mt-6 max-w-6xl text-[2.4rem] text-muted sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.15s" }}
        >
          Diseñamos y construimos{" "}
          <span className="text-foreground">
            {listNames(top.map((p) => p.name))}.
          </span>
        </h1>

        <div
          className="hero-rise mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="max-w-md text-lg leading-relaxed text-muted">
            Somos Franco y Federico, un estudio de dos personas. Tu proyecto lo
            trabajamos nosotros, de la primera charla a la puesta en línea.
          </p>
          <div className="flex items-center gap-6">
            <ButtonLink href="/#contact">
              Escribinos
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <Link
              href="/pricing"
              className="focus-ring text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              Ver precios
            </Link>
          </div>
        </div>

        <figure
          className="hero-rise mt-16 md:mt-20"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            href={`/work/${lead.slug}`}
            className="focus-ring group block overflow-hidden rounded-md border border-border"
          >
            <Image
              src={lead.image}
              alt={`Sitio de ${lead.name}`}
              width={1425}
              height={681}
              priority
              sizes="(min-width: 1400px) 1320px, 100vw"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </Link>
          <figcaption className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm md:grid-cols-[auto_1fr_auto_auto] md:items-baseline">
            <span className="font-mono text-muted">{lead.number}</span>
            <span className="text-foreground">
              {lead.name}{" "}
              <span className="text-muted">— {lead.shortDescription}</span>
            </span>
            <span className="col-start-2 font-mono text-muted md:col-start-auto">
              {lead.year}
            </span>
            {lead.url && (
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring col-start-2 inline-flex items-center gap-1 font-mono text-muted transition-colors hover:text-foreground md:col-start-auto"
              >
                {new URL(lead.url).hostname.replace(/^www\./, "")}
                <ArrowUpRight size={13} />
              </a>
            )}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
