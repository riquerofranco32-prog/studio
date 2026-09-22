"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { FounderVoiceWave } from "@/components/ui/founder-voice-wave";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-20 md:py-28">
      <Container>
        <h2 className="display text-[2.6rem] uppercase text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span className="line-mask block">
            <RevealText index={0}>Dos fundadores</RevealText>
          </span>
          <span className="line-mask block">
            <RevealText index={1}>senior. Cero</RevealText>
          </span>
          <span className="line-mask block">
            <RevealText index={2}>
              <span className="text-accent">burocracia.</span>
            </RevealText>
          </span>
        </h2>

        {/* Una tarjeta por fundador: foto + nombre + rol + bio + LinkedIn,
            cada dato una sola vez. Antes el nombre y el rol se repetían dos
            veces (en el hover de la foto y de nuevo abajo en la bio). */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-5 rounded-3xl border border-border bg-surface/40 p-6 sm:flex-row sm:items-start md:p-8"
            >
              {member.imageUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-24 sm:w-24">
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
                      className="focus-ring shrink-0 text-muted transition-colors hover:text-accent"
                    >
                      <LinkedinIcon size={18} />
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

        <div className="mt-8 md:mx-auto md:max-w-md">
          <FounderVoiceWave />
        </div>
      </Container>
    </section>
  );
}
