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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <h2 className="display text-[2.6rem] uppercase text-foreground sm:text-6xl md:text-7xl lg:col-span-8 lg:text-[5.5rem]">
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

          <div className="flex gap-4 lg:col-span-4 lg:justify-end">
            {team.map((member) => (
              <div
                key={member.id}
                className="relative aspect-[3/4] w-1/2 max-w-[220px] overflow-hidden rounded-2xl border border-border grayscale transition-all duration-500 hover:grayscale-0"
              >
                <Image
                  src={member.imageUrl ?? ""}
                  alt={member.name ?? ""}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {team.map((member) => (
            <div key={member.id}>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <h3 className="font-medium text-foreground">{member.name}</h3>
                <Link
                  href={member.linkedin ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-muted transition-colors hover:text-accent"
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <LinkedinIcon size={16} />
                </Link>
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent">
                {member.role}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 md:max-w-md">
          <FounderVoiceWave />
        </div>
      </Container>
    </section>
  );
}
