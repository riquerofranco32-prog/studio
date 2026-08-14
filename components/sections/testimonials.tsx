import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/data/team";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading kicker="Testimonios" title="Lo que dicen." />
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="border-t border-border pt-6">
              <p className="text-xl text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-muted">
                {t.name}, {t.role} en {t.company}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
