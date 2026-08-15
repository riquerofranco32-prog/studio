import { LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Nosotros"
          title="Equipo chico. Pensamiento digital grande."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
          <div className="md:col-span-7">
            <p className="text-2xl leading-snug text-foreground md:text-[2rem]">
              Combinamos diseño, tecnología y estrategia para crear experiencias
              digitales que{" "}
              <span className="text-accent">
                se sienten tan bien como funcionan
              </span>
              .
            </p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              Somos dos. Eso significa que hablás directo con quienes diseñan y
              escriben el código de tu proyecto — sin capas intermedias, sin
              equipos rotando, sin briefs que se pierden en el camino.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-5">
            {team.map((member) => (
              <div key={member.id} className="group">
                <div className="relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-500 group-hover:border-accent/30">
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-widest text-muted/50 uppercase">
                    Foto
                  </span>
                </div>
                <p className="text-lg font-medium tracking-tight text-foreground">
                  {member.name ?? "Nombre a definir"}
                </p>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-3 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <LinkedinIcon size={14} />
                    LinkedIn
                    <span className="sr-only"> de {member.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
