import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/data/team";

export function Testimonials() {
  // Se oculta sola mientras no haya testimonios reales cargados en data/team.ts.
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading kicker="Testimonios" title="Lo que dicen." />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="rounded-2xl border border-border bg-surface p-8 transition-colors duration-500 hover:border-accent/30 md:p-10"
            >
              <Quote size={22} aria-hidden className="text-accent" />
              <p className="mt-6 text-xl leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-8 border-t border-border pt-5 text-sm text-muted">
                <span className="text-foreground">{t.name}</span> — {t.role} en{" "}
                {t.company}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
