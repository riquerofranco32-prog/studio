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
      <p className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">
        {kicker}
      </p>
      <RevealText
        as="h2"
        className="text-4xl font-medium tracking-tight text-foreground md:text-5xl"
      >
        {title}
      </RevealText>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}
