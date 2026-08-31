"use client";

import { ArrowRight, MessageCircle, Sparkles, Clock, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { SITE } from "@/data/site";

function getAvailabilityMonth(): string {
  const now = new Date();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ];
  const targetMonth = day > daysInMonth * 0.8 ? now.getMonth() + 1 : now.getMonth();
  const year = now.getFullYear() + (targetMonth > 11 ? 1 : 0);
  return `${monthNames[targetMonth % 12]} ${year}`;
}

export function CtaBanner() {
  const [month, setMonth] = useState("");
  useEffect(() => { setMonth(getAvailabilityMonth()); }, []);

  const whatsappUrl = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Hola Se7en Studio! Me gustaría consultarles por un nuevo proyecto.",
  )}`;

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface via-surface to-background p-8 md:p-16 lg:p-20">
          {/* Resplandor de acento de fondo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/15 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/10 blur-[100px]"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Disponibilidad pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 font-mono text-xs text-foreground backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Disponibilidad {month}: 2 cupos abiertos</span>
            </div>

            <h2 className="display mt-8 text-4xl text-foreground sm:text-5xl md:text-6xl">
              ¿Listo para construir tu próximo <span className="text-accent">producto digital?</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
              Dejanos tu idea o consulta. Te respondemos con un diagnóstico inicial, estimación de tiempos y propuesta en menos de 24 horas.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <ButtonLink href="/#contact">
                  <Sparkles size={16} className="text-background" />
                  <span>Iniciar un proyecto</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </ButtonLink>
              </Magnetic>

              <Magnetic>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-emerald-500/50 hover:bg-surface-2 hover:text-emerald-400"
                >
                  <MessageCircle size={16} className="text-emerald-400" />
                  <span>Escribir por WhatsApp</span>
                </a>
              </Magnetic>
            </div>

            {/* Garantías y métricas de soporte */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 border-t border-border/80 pt-8 text-xs font-mono text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-accent" />
                Respuesta en &lt; 24hs
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-accent" />
                Entrega en 2 a 4 semanas
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                Garantía y soporte post-lanzamiento
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
