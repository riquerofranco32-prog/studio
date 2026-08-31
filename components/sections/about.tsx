"use client";

import Link from "next/link";
import { Quote, ArrowUpRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamRoster } from "@/components/sections/team-roster";
import { FounderVoiceWave } from "@/components/ui/founder-voice-wave";
import { team, testimonials } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="El Estudio & Confianza"
            title="Dos fundadores senior. Cero burocracia."
            subtitle="Trabajás de forma directa con los dos ingenieros y diseñadores que crean y despliegan cada píxel y línea de código."
          />

          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-mono text-muted shrink-0">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-foreground font-medium">100% Satisfacción</span>
          </div>
        </div>

        {/* Declaración de Valor y Voice Note */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
          <p className="text-2xl leading-snug text-foreground md:col-span-7 md:text-[2rem]">
            Combinamos dirección de diseño, arquitectura moderna de software y foco comercial para crear productos que{" "}
            <span className="text-accent">
              cargan en milisegundos y convierten visitas en clientes
            </span>
            .
          </p>
          <div className="space-y-4 text-base leading-relaxed text-muted md:col-span-5 md:text-lg">
            <p>
              Sin gerentes de cuentas ni desarrolladores juniors tercerizados. Comunicación diaria y sprints transparentes en staging.
            </p>
            <FounderVoiceWave />
          </div>
        </div>

        {/* Roster de Fundadores */}
        <div className="mt-16">
          <TeamRoster members={team} />
        </div>

        {/* Testimonios Reales de Clientes */}
        <div className="mt-20 border-t border-border pt-16">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-8">
            Lo que dicen los fundadores
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {testimonials.map((t) => {
              const initials = t.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <blockquote
                  key={t.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:p-10"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
                  />

                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <Quote size={22} aria-hidden className="text-accent" />
                      {t.highlight && (
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 font-mono text-[11px] text-accent">
                          {t.highlight}
                        </span>
                      )}
                    </div>

                    <p className="mt-5 text-base leading-relaxed text-foreground md:text-lg">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-xs font-semibold text-accent shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <cite className="not-italic block font-medium text-foreground text-sm">
                          {t.name}
                        </cite>
                        <span className="block text-xs text-muted">
                          {t.role} · <span className="text-foreground/90 font-medium">{t.company}</span>
                        </span>
                      </div>
                    </div>

                    {t.projectSlug && (
                      <Link
                        href={`/work/${t.projectSlug}`}
                        className="focus-ring inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
                      >
                        <span>Ver caso</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </footer>
                </blockquote>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
