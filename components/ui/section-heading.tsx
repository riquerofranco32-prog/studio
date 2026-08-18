import { RevealText } from "@/components/ui/reveal-text";

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-5 flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted uppercase">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
        {kicker}
      </p>
      {/* El tamaño va en el <h2> y no dentro de <RevealText> a propósito: la
          máscara compensa su padding con un margen negativo en em, y ese em
          tiene que resolver contra el cuerpo del titular. Con las clases
          adentro resolvía contra los 16px heredados y le comía 5px a la panza
          de la "j" de Trabajo y la "g" de digital. */}
      <h2 className="display text-4xl text-foreground md:text-6xl">
        <RevealText>{title}</RevealText>
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}
