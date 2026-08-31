"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { TeamMember } from "@/types";

export function TeamRoster({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {members.map((member, i) => {
        const number = String(i + 1).padStart(2, "0");
        const displayName = member.name || "Fundador";

        return (
          <div
            key={member.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-all duration-500 hover:border-accent/40 hover:bg-surface-2 md:p-10 shadow-lg"
          >
            {/* Filete de acento superior que se expande en hover */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
            />

            <div>
              {/* Header con Foto nítida + Número */}
              <div className="flex items-start justify-between gap-6">
                <div className="relative">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-2 border-border/80 bg-background shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:border-accent/40">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={displayName}
                        width={280}
                        height={280}
                        sizes="(max-width: 768px) 112px, 128px"
                        priority
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xl font-bold text-accent">
                        {displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-surface bg-emerald-500" />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                    Fundador {number}
                  </span>
                </div>
              </div>

              {/* Info del Fundador */}
              <div className="mt-6">
                <h3 className="display text-3xl text-foreground sm:text-4xl">
                  {displayName}
                </h3>
                <p className="mt-1.5 font-mono text-xs text-accent font-semibold uppercase tracking-wider">
                  {member.role}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Footer con Enlace Directo a LinkedIn */}
            {member.linkedin && (
              <div className="mt-8 border-t border-border/80 pt-6">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver perfil de LinkedIn de ${displayName}`}
                  className="focus-ring group/link inline-flex items-center justify-between w-full rounded-2xl border border-border bg-background/80 px-5 py-3 font-mono text-xs text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkedinIcon size={16} className="text-[#0077b5] group-hover/link:text-accent transition-colors" />
                    <span className="font-medium text-foreground">Conectar en LinkedIn</span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-muted transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
                  />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
