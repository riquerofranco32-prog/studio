"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Zap, CalendarCheck, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/data/site";

// Slots disponibles — actualizar manualmente según disponibilidad real del estudio.
const SLOTS_AVAILABLE = 2;

// Mes de disponibilidad próxima (se actualiza automáticamente al mes siguiente si es fin de mes).
function getAvailabilityMonth(): string {
  const now = new Date();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  // Si queda menos del 20% del mes, mostramos el siguiente
  const targetMonth = day > daysInMonth * 0.8
    ? now.getMonth() + 1
    : now.getMonth();
  const year = now.getFullYear() + (targetMonth > 11 ? 1 : 0);
  return `${monthNames[targetMonth % 12]} ${year}`;
}

export function AvailabilityBanner() {
  const [month, setMonth] = useState("");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setMonth(getAvailabilityMonth());
    // Pulse periódico para llamar la atención
    const id = setInterval(() => setPulse((p) => !p), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-t border-border bg-surface/40 py-10">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 via-accent/[0.03] to-transparent p-6 sm:p-8">
          {/* Glow de fondo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[80px]"
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Izquierda: indicador + texto */}
            <div className="flex items-start gap-5">
              {/* Indicador de estado animado */}
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 transition-all duration-1000 ${
                      pulse ? "animate-ping" : ""
                    }`}
                  />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Estudio Disponible
                  </span>
                  <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                    {SLOTS_AVAILABLE} slots abiertos
                  </span>
                </div>

                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Aceptando proyectos para{" "}
                  <span className="text-accent">{month || "próximas semanas"}</span>
                </p>

                {/* Detalles en fila */}
                <div className="mt-3 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                    <CalendarCheck size={13} className="text-accent/70" />
                    Kickoff en 7 días hábiles
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                    <Clock size={13} className="text-accent/70" />
                    Respuesta &lt; 2 hs hábiles
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                    <Zap size={13} className="text-accent/70" />
                    Diseño + Dev sin intermediarios
                  </span>
                </div>
              </div>
            </div>

            {/* Derecha: CTA */}
            <div className="flex shrink-0 items-center gap-3">
              <a
                href="/#contact"
                id="availability-cta"
                className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_0_24px_rgba(255,77,46,0.3)] transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_0_32px_rgba(255,77,46,0.45)]"
              >
                Reservar un slot
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                id="availability-whatsapp"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-3 text-xs font-medium text-muted transition-all duration-300 hover:border-accent/40 hover:text-foreground"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
