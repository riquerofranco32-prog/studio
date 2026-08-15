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
      <RevealText
        as="h2"
        className="display text-4xl text-foreground md:text-6xl"
      >
        {title}
      </RevealText>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}
