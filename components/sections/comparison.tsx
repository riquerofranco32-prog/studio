"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

interface ComparisonRow {
  feature: string;
  se7en: string;
  agency: string;
  freelance: string;
}

const rows: ComparisonRow[] = [
  {
    feature: "Interlocutores y Comunicación",
    se7en: "Directo con los 2 fundadores (Diseño & Dev)",
    agency: "3 a 5 intermediarios (PM, Account, Junior dev)",
    freelance: "1 sola persona (generalmente desborda)",
  },
  {
    feature: "Tiempo de Entrega",
    se7en: "2 a 4 semanas con entregas continuas",
    agency: "3 a 6 meses de burocracia y aprobaciones",
    freelance: "Variable e impredecible",
  },
  {
    feature: "Calidad de Código & Craft",
    se7en: "100% a medida sobre Next.js, React 19 y Tailwind",
    agency: "Frecuentemente plantillas o código tercerizado",
    freelance: "Dispar según la especialidad del profesional",
  },
  {
    feature: "Sinergia Diseño + Desarrollo",
    se7en: "Integración total desde el primer mockup",
    agency: "Departamentos aislados que se culpan mutuamente",
    freelance: "Sólo diseño o sólo código (rara vez ambos)",
  },
  {
    feature: "Garantía & Soporte",
    se7en: "30 días de garantía y soporte directo incluido",
    agency: "Contratos de retención mensuales costosos",
    freelance: "Soporte no garantizado post-entrega",
  },
];

export function Comparison() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="El Modelo Boutique"
          title="Por qué elegir Se7en."
          subtitle="Comparamos nuestro enfoque directo y ágil frente a las alternativas tradicionales del mercado."
        />

        <div className="mt-16 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[720px]">
            {/* Header de columnas */}
            <div className="grid grid-cols-12 gap-4 border-b border-border pb-6">
              <div className="col-span-4 font-mono text-xs text-muted uppercase tracking-wider">
                Criterio
              </div>
              <div className="col-span-3 rounded-t-xl bg-surface px-4 py-2 text-center border-t-2 border-accent">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                  <Sparkles size={13} />
                  Se7en Studio
                </span>
              </div>
              <div className="col-span-3 px-4 py-2 text-center">
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  Agencia Tradicional
                </span>
              </div>
              <div className="col-span-2 px-4 py-2 text-center">
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  Freelancer
                </span>
              </div>
            </div>

            {/* Filas comparativas */}
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-12 items-center gap-4 py-6 transition-colors hover:bg-surface/30"
                >
                  <div className="col-span-4">
                    <span className="text-base font-medium text-foreground">
                      {row.feature}
                    </span>
                  </div>

                  <div className="col-span-3 rounded-lg border border-accent/20 bg-surface/80 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {row.se7en}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">
                        <X size={12} />
                      </span>
                      <span className="text-sm text-muted">
                        {row.agency}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">
                        <X size={12} />
                      </span>
                      <span className="text-sm text-muted">
                        {row.freelance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
