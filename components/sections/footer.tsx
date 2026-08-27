import Link from "next/link";
import Image from "next/image";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/data/site";

const links = [
  { href: "/work", label: "Portafolio" },
  { href: "/services", label: "Servicios" },
  { href: "/#estimator", label: "Cotizador" },
  { href: "/#about", label: "Nosotros" },
  { href: "/#contact", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-border pt-16">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div>
              <Image
                src="/logo.png"
                alt={SITE.name}
                width={800}
                height={224}
                // Sin `sizes` Next asume que la imagen puede ocupar todo el ancho y
                // sirve la variante de 1920px para un logo que se pinta a ~115px.
                sizes="120px"
                className="h-8 w-auto"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Experiencias digitales. Construidas con intención.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring mt-6 inline-block text-base text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {SITE.email}
              </a>
            </div>

            <div className="flex gap-16">
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                {SITE.social.instagram && (
                  <a
                    href={SITE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <InstagramIcon size={14} /> Instagram
                  </a>
                )}
                {SITE.social.linkedin && (
                  <a
                    href={SITE.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <LinkedinIcon size={14} /> LinkedIn
                  </a>
                )}
                {SITE.social.github && (
                  <a
                    href={SITE.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <GithubIcon size={14} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} {SITE.name}. Todos los derechos
              reservados.
            </p>
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-1 text-foreground transition-colors hover:text-accent"
            >
              Hecho por {SITE.name} &#8599;
            </Link>
          </div>
        </Reveal>
      </Container>

      {/* Wordmark de cierre: la marca ocupa el ancho completo y se corta abajo. */}
      <Reveal index={1} className="mt-10 overflow-hidden">
        <div aria-hidden>
          <p className="display translate-y-[0.18em] text-center text-[18vw] leading-none whitespace-nowrap text-foreground/[0.045]">
            {SITE.name}
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
