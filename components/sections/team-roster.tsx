"use client";

import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Code2, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { TeamMember } from "@/types";

interface ExtendedTeamMember extends TeamMember {
  skills?: string[];
  focus?: string;
  experience?: string;
}

const membersData: Record<string, { skills: string[]; focus: string; experience: string }> = {
  "founder-01": {
    skills: ["Next.js 16", "TypeScript Strict", "Supabase Postgres", "Server Actions", "Vercel Edge", "Zod"],
    focus: "Arquitectura Full-Stack, Rendimiento Edge & Seguridad Zero-Trust",
    experience: "+5 años construyendo productos y plataformas SaaS de alta escala",
  },
  "founder-02": {
    skills: ["Figma Systems", "UI/UX Craft", "Design Tokens", "Micro-Interactions", "Motion 60 FPS", "Branding"],
    focus: "Dirección Visual, Sistemas de Diseño & Conversión de Producto",
    experience: "+5 años transformando modelos de negocio en experiencias de alta gama",
  },
};

export function TeamRoster({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {members.map((member, i) => {
        const number = String(i + 1).padStart(2, "0");
        const displayName = member.name || "Fundador";
        const meta = membersData[member.id] || {
          skills: ["Next.js", "TypeScript", "UI/UX"],
          focus: "Desarrollo y Diseño",
          experience: "Especialista senior",
        };
        const isEngineer = member.id === "founder-01";

        return (
          <div
            key={member.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface via-surface to-surface/90 p-8 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(255,77,46,0.1)] md:p-10"
          >
            {/* Filete superior interactivo */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
            />

            <div>
              {/* Header: Foto + Rol + Badges */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border-2 border-border/90 bg-background shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:border-accent/50">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={displayName}
                          width={240}
                          height={240}
                          sizes="(max-width: 768px) 80px, 96px"
                          priority
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-xl font-bold text-accent">
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Status Dot */}
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4" title="Activo en Sprints">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-surface bg-emerald-500" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                        Fundador {number}
                      </span>
                      <span className="text-border">·</span>
                      <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                        {isEngineer ? <Code2 size={12} className="text-accent" /> : <Palette size={12} className="text-accent" />}
                        {isEngineer ? "Ingeniería" : "Diseño & Craft"}
                      </span>
                    </div>

                    <h3 className="display mt-1 text-2xl text-foreground sm:text-3xl font-bold">
                      {displayName}
                    </h3>

                    <p className="mt-0.5 font-mono text-xs text-muted">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio & Enfoque */}
              <div className="mt-6 space-y-4">
                <p className="text-sm leading-relaxed text-muted md:text-base">
                  {member.bio}
                </p>

                <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 text-xs text-muted">
                  <span className="font-mono text-accent font-semibold uppercase tracking-wider block mb-1">
                    Enfoque Directo
                  </span>
                  <p className="text-foreground/90 leading-relaxed font-medium">
                    {meta.focus}
                  </p>
                </div>

                {/* Stack & Habilidades clave */}
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-2 font-medium">
                    Especialidad & Herramientas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {meta.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors group-hover:border-accent/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con Enlace a LinkedIn */}
            {member.linkedin && (
              <div className="mt-8 border-t border-border/70 pt-5">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver perfil de LinkedIn de ${displayName}`}
                  className="focus-ring group/link inline-flex items-center justify-between w-full rounded-2xl border border-border bg-background/80 px-4 py-2.5 font-mono text-xs text-muted transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkedinIcon size={15} className="text-[#0077b5] group-hover/link:text-accent transition-colors" />
                    <span className="font-medium text-foreground">Conectar en LinkedIn</span>
                  </span>
                  <ArrowUpRight
                    size={14}
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
