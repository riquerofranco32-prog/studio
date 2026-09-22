"use client";

import Image from "next/image";
import { TeamMember } from "@/types";

/**
 * Fotos de los fundadores que se expanden al hover/focus, cada una revela
 * nombre + rol y linkea a LinkedIn. Adaptado de un accordion de imágenes
 * genérico: acá cada panel es un fundador real, no un placeholder.
 */
export function FounderShowcase({ members }: { members: TeamMember[] }) {
  return (
    <div className="group flex gap-3 md:gap-4">
      {members.map((member) => (
        <a
          key={member.id}
          href={member.linkedin ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${member.name}`}
          className="group/panel relative aspect-[3/4] w-1/2 max-w-[220px] overflow-hidden rounded-2xl border border-border transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] focus-ring md:not-[&:hover]:group-hover:w-[38%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[38%]"
        >
          {member.imageUrl && (
            <Image
              src={member.imageUrl}
              alt={member.name ?? ""}
              fill
              sizes="220px"
              className="object-cover grayscale transition-all duration-500 group-hover/panel:grayscale-0"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent opacity-0 translate-y-2 transition-all duration-300 group-hover/panel:opacity-100 group-hover/panel:translate-y-0 group-focus-within/panel:opacity-100 group-focus-within/panel:translate-y-0">
              {member.role}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground opacity-0 translate-y-2 transition-all duration-300 delay-75 group-hover/panel:opacity-100 group-hover/panel:translate-y-0 group-focus-within/panel:opacity-100 group-focus-within/panel:translate-y-0">
              {member.name}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
