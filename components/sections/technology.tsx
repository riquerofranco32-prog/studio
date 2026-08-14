import { Container } from "@/components/ui/container";
import { technologies } from "@/data/services";

export function Technology() {
  return (
    <section className="border-t border-border py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Built with
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="text-lg tracking-tight text-muted transition-colors hover:text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
