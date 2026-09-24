"use client";

import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { projects } from "@/data/projects";

// Sólo afirmaciones que ya sostenemos en otras partes del sitio: los
// proyectos de data/projects.ts (todos con URL en producción), los plazos de
// Proceso, la respuesta en 24 h de Contacto/FAQ y la propiedad del código.
// La marquesina de marcas vive una sola vez, al pie del hero.
const keyStats = [
  { value: `${projects.length}`, label: "Proyectos en producción" },
  { value: "2–3", label: "Semanas de idea a producción" },
  { value: "24h", label: "Respuesta a cada consulta" },
  { value: "100%", label: "Del código es tuyo" },
];

export function Proof() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container>
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          El estudio, en números
        </p>

        {/* Fila editorial de métricas: número gigante, sin chrome de card. */}
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 lg:grid-cols-4">
          {keyStats.map((stat) => (
            <div key={stat.label}>
              <span className="display block text-5xl text-foreground md:text-6xl">
                <CountUp value={stat.value} />
              </span>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
