import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading kicker="Services" title="From idea to interface." />

        <div className="mt-16 grid grid-cols-1 border-t border-border md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.number}
              className="group flex items-start gap-6 border-b border-border py-10 transition-colors md:odd:border-r md:odd:pr-10 md:even:pl-10"
            >
              <span className="font-mono text-sm text-muted">
                {service.number}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-sm text-muted">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
