import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamRoster } from "@/components/sections/team-roster";
import { FounderVoiceWave } from "@/components/ui/founder-voice-wave";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          kicker="Equipo Senior"
          title="Foco de fundadores. Cero intermediarios."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-x-8 lg:gap-x-16">
          <p className="text-2xl leading-snug text-foreground md:col-span-7 md:text-[2rem]">
            Combinamos dirección de diseño, ingeniería moderna de software y mentalidad de negocio para crear experiencias que{" "}
            <span className="text-accent">
              se sienten fluidas y convierten usuarios en clientes
            </span>
            .
          </p>
          <div className="space-y-4 text-base leading-relaxed text-muted md:col-span-5 md:text-lg">
            <p>
              Somos dos fundadores especializados. Al trabajar con nosotros, eliminás las capas de burocracia y hablás directamente con quienes diseñan los píxeles y escriben cada línea de código.
            </p>
            <FounderVoiceWave />
          </div>
        </div>

        <div className="mt-20">
          <TeamRoster members={team} />
        </div>
      </Container>
    </section>
  );
}
