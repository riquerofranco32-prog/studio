import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamRoster } from "@/components/sections/team-roster";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Nosotros"
          title="Equipo chico. Pensamiento digital grande."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
          <p className="text-2xl leading-snug text-foreground md:col-span-7 md:text-[2rem]">
            Combinamos diseño, tecnología y estrategia para crear experiencias
            digitales que{" "}
            <span className="text-accent">
              se sienten tan bien como funcionan
            </span>
            .
          </p>
          <p className="text-lg leading-relaxed text-muted md:col-span-5">
            Somos dos. Eso significa que hablás directo con quienes diseñan y
            escriben el código de tu proyecto — sin capas intermedias, sin
            equipos rotando, sin briefs que se pierden en el camino.
          </p>
        </div>

        <div className="mt-20">
          <TeamRoster members={team} />
        </div>
      </Container>
    </section>
  );
}
