import { ReactNode } from "react";

/**
 * Marquesina infinita en CSS puro. Duplica los hijos para que el track pueda
 * desplazarse -50% y volver a 0 sin salto visible. La copia va con aria-hidden
 * para no duplicar el contenido en lectores de pantalla.
 */
export function Marquee({
  children,
  duration = 40,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`marquee relative overflow-hidden ${className}`}>
      <div
        className="marquee-track flex"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>

      {/* Difuminado en los bordes: la marquesina entra y sale del fondo. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent md:w-24" />
    </div>
  );
}
