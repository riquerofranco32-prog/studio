import { SITE } from "@/data/site";

/**
 * Drop-in footer credit for client projects — copy this component (or just the markup)
 * into a client site's footer to link back to {@link SITE.url}.
 */
export function BuiltByBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={SITE.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`focus-ring inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground ${className}`}
    >
      Hecho por {SITE.name} &#8599;
    </a>
  );
}
