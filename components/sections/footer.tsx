import Link from "next/link";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { SITE } from "@/data/site";

const links = [
  { href: "/#work", label: "Trabajo" },
  { href: "/#services", label: "Servicios" },
  { href: "/#about", label: "Nosotros" },
  { href: "/#contact", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <Container>
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div>
            <p className="font-mono text-sm font-medium tracking-widest">
              {SITE.name}
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Experiencias digitales. Construidas con intención.
            </p>
          </div>

          <div className="flex gap-16">
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <InstagramIcon size={14} /> Instagram
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <LinkedinIcon size={14} /> LinkedIn
              </a>
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <GithubIcon size={14} /> GitHub
              </a>
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
            className="focus-ring inline-flex items-center gap-1 text-foreground"
          >
            Hecho por {SITE.name} &#8599;
          </Link>
        </div>
      </Container>
    </footer>
  );
}
