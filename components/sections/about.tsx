"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-20 md:py-28">
      <Container>
        {/* Misma escala que el resto de las secciones. A 2.6rem "DOS
            FUNDADORES" no entraba en los 342px útiles de un celular de 390. */}
        <div className="max-w-2xl">
          <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
            <span className="text-accent">●</span> Estudio
          </p>
          <h2 className="display text-4xl text-balance uppercase text-foreground md:text-6xl">
            <RevealText index={0}>Dos fundadores senior.</RevealText>
            <RevealText index={1}>
              <span className="text-accent">Cero burocracia.</span>
            </RevealText>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Hablás directo con quien diseña y con quien programa tu proyecto.
            Sin ejecutivos de cuenta ni intermediarios.
          </p>
        </div>

        {/* Una tarjeta por fundador: foto + nombre + rol + bio + LinkedIn,
            cada dato una sola vez. Antes el nombre y el rol se repetían dos
            veces (en el hover de la foto y de nuevo abajo en la bio). */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/40 p-6 transition-colors duration-300 hover:border-foreground/20 hover:bg-surface md:p-8 lg:flex-row lg:items-start"
            >
              {member.imageUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border lg:h-24 lg:w-24">
                  <Image
                    src={member.imageUrl}
                    alt={member.name ?? ""}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {member.name}
                  </h3>
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${member.name}`}
                      className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:bg-accent hover:text-background"
                    >
                      <LinkedinIcon size={16} />
                    </Link>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
