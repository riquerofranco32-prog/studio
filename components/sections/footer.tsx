"use client";

import Link from "next/link";
import Image from "next/image";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { LiveClock } from "@/components/ui/live-clock";
import { SITE } from "@/data/site";
import { ArrowUpRight, Sparkles, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border pt-20 bg-background/50">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Columna Marca & Estado */}
            <div className="lg:col-span-4">
              <Image
                src="/logo.png"
                alt={SITE.name}
                width={800}
                height={224}
                sizes="120px"
                className="h-8 w-auto"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Estudio boutique de software y diseño en Argentina. Construimos SaaS, E-Commerce y productos web en Next.js 16 con velocidad sub-segundo.
              </p>

              {/* Status & Clock */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Argentina (GMT-3)</span>
                  <span className="text-foreground font-semibold">
                    <LiveClock />
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  <Mail size={13} />
                  <span>{SITE.email}</span>
                </a>

                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-foreground hover:border-emerald-400 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Columnas de Links */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
              {/* Navegación */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-bold mb-4">
                  Explorar
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/work" className="text-muted hover:text-foreground transition-colors">
                      Portafolio de Casos
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-muted hover:text-foreground transition-colors">
                      Servicios & Precios
                    </Link>
                  </li>
                  <li>
                    <Link href="/tech" className="text-muted hover:text-foreground transition-colors">
                      Radar Tecnológico
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-muted hover:text-foreground transition-colors">
                      Blog de Ingeniería
                    </Link>
                  </li>
                  <li>
                    <Link href="/playground" className="text-muted hover:text-foreground transition-colors">
                      Playground Técnico
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-muted hover:text-foreground transition-colors">
                      Seguridad & NDA
                    </Link>
                  </li>
                  <li>
                    <Link href="/#about" className="text-muted hover:text-foreground transition-colors">
                      Sobre el Estudio
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Herramientas */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-bold mb-4">
                  Herramientas
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/start" className="text-accent font-medium hover:underline flex items-center gap-1">
                      <span>Iniciar Briefing</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/roi" className="text-muted hover:text-foreground transition-colors">
                      Calculadora de ROI
                    </Link>
                  </li>
                  <li>
                    <Link href="/portal" className="text-muted hover:text-foreground transition-colors">
                      Demo Portal de Staging
                    </Link>
                  </li>
                  <li>
                    <Link href="/#estimator" className="text-muted hover:text-foreground transition-colors">
                      Cotizador en Vivo
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-badge-generator"))}
                      className="text-muted hover:text-foreground transition-colors text-left"
                    >
                      Insignia "Built by Se7en"
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
                      className="text-muted hover:text-foreground transition-colors text-left"
                    >
                      Agendar Discovery Call
                    </button>
                  </li>
                </ul>
              </div>

              {/* Redes */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-bold mb-4">
                  Social & Código
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {SITE.social.github && (
                    <li>
                      <a
                        href={SITE.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                      >
                        <GithubIcon size={14} /> GitHub
                      </a>
                    </li>
                  )}
                  {SITE.social.linkedin && (
                    <li>
                      <a
                        href={SITE.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                      >
                        <LinkedinIcon size={14} /> LinkedIn
                      </a>
                    </li>
                  )}
                  {SITE.social.instagram && (
                    <li>
                      <a
                        href={SITE.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                      >
                        <InstagramIcon size={14} /> Instagram
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span>Next.js 16 · Turbopack</span>
              <span>·</span>
              <span className="text-emerald-400">Core Web Vitals 100/100</span>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Wordmark de cierre */}
      <Reveal index={1} className="mt-10 overflow-hidden">
        <div aria-hidden>
          <p className="display translate-y-[0.18em] text-center text-[18vw] leading-none whitespace-nowrap text-foreground/[0.045] select-none">
            {SITE.name}
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
