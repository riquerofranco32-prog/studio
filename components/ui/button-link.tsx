import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Texto oscuro sobre el acento, no blanco: #fff sobre #ff4d2e da 3.31:1 y no
// llega al 4.5:1 que pide WCAG AA para etiquetas de 14px. En negativo da 5.99:1.
const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-background hover:bg-accent/90 border border-transparent",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-foreground/40 hover:bg-white/[0.04]",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-foreground",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const classes = `focus-ring group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors duration-300 ${variants[variant]} ${className}`;

  const isMail = href.startsWith("mailto:");
  const isAbsolute = href.startsWith("http");

  if (external || isMail || isAbsolute) {
    // mailto: abre el cliente de correo — un target="_blank" ahí deja una pestaña vacía.
    const newTab = isMail ? {} : { target: "_blank", rel: "noopener noreferrer" };
    return (
      <a href={href} className={classes} {...newTab}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
