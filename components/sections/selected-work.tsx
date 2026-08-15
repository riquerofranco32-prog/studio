import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/data/projects";

const spans = [
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-6",
  "md:col-span-6",
];

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
          <ButtonLink href="/#contact" variant="secondary" className="shrink-0">
            Quiero algo así
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </ButtonLink>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
          {sorted.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={i === 0}
              className={spans[i] ?? "md:col-span-6"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
