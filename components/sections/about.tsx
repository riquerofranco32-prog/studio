import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE } from "@/data/site";
import { team } from "@/data/team";

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="About"
          title="Small team. Big digital thinking."
        />

        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl">
          We combine design, technology and strategy to create digital
          experiences that feel as good as they perform.
        </p>

        <div className="mt-16 grid grid-cols-3 gap-6 border-y border-border py-10 sm:max-w-xl">
          <Stat value={SITE.stats.projects} label="Projects" />
          <Stat value={SITE.stats.people} label="People" />
          <Stat value={SITE.stats.years} label="" />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {team.map((member) => (
            <div key={member.id} className="border-t border-border pt-6">
              <div className="mb-5 aspect-square w-full max-w-[220px] bg-white/[0.03]" />
              <p className="text-lg font-medium tracking-tight text-foreground">
                {member.name ?? "Name to be added"}
              </p>
              <p className="mt-1 text-sm text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {value}
      </p>
      {label && <p className="mt-1 text-sm text-muted">{label}</p>}
    </div>
  );
}
