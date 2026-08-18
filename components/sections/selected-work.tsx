import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/data/projects";

// El ancho de columna y la pista de `sizes` viven juntos a propósito: si se
// cambia el span y la pista queda vieja, el navegador baja una imagen del tamaño
// equivocado y no lo avisa nadie. Anchos reales con el contenedor en su máximo
// (1320px útiles, gap de 24px): 8 cols = 872px, 6 = 648px, 4 = 424px.
const layout = [
  { span: "md:col-span-8", sizes: "(min-width: 1440px) 880px, (min-width: 768px) 67vw, 100vw" },
  { span: "md:col-span-4", sizes: "(min-width: 1440px) 430px, (min-width: 768px) 33vw, 100vw" },
  { span: "md:col-span-8", sizes: "(min-width: 1440px) 880px, (min-width: 768px) 67vw, 100vw" },
  { span: "md:col-span-4", sizes: "(min-width: 1440px) 430px, (min-width: 768px) 33vw, 100vw" },
  { span: "md:col-span-6", sizes: "(min-width: 1440px) 660px, (min-width: 768px) 50vw, 100vw" },
  { span: "md:col-span-6", sizes: "(min-width: 1440px) 660px, (min-width: 768px) 50vw, 100vw" },
];

const fallbackLayout = layout[4];

// La grilla son tres filas de dos, asi que la posicion dentro de la fila es
// i % 2 — y la cascada escalona lo que entra junto. Con i a secas la ultima
// tarjeta esperaria 450ms despues de ya estar en pantalla, que no se lee como
// cascada sino como demora.

export function SelectedWork() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="work" className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            kicker="Trabajo seleccionado"
            title="Trabajo seleccionado."
            subtitle={`${sorted.length} experiencias digitales que diseñamos y construimos.`}
          />
          <Magnetic className="shrink-0">
            <ButtonLink href="/#contact" variant="secondary">
              Quiero algo así
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
          </Magnetic>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
          {sorted.map((project, i) => {
            const { span, sizes } = layout[i] ?? fallbackLayout;
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={i === 0}
                className={span}
                sizes={sizes}
                index={i % 2}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
