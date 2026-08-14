import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
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
        <SectionHeading
          kicker="Selected work"
          title="Selected work."
          subtitle="Six digital experiences we've designed and built."
        />

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
