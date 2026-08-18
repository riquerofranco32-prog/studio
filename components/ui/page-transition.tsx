import { ReactNode, ViewTransition } from "react";

/**
 * Envoltorio de transición direccional de página.
 *
 * VA EN CADA page.tsx, NUNCA en el layout: los layouts persisten entre
 * navegaciones, así que su enter/exit no dispara jamás y la transición se ve
 * como un corte seco (doc local: view-transitions.md, "Put the wrapper in each
 * page.tsx, not the layout").
 *
 * `default: "none"` deja sin animación direccional todo lo que no traiga tipo
 * explícito — el back del navegador, los gestos de swipe, router.refresh() y
 * los reveals de Suspense. Sólo se mueve lo que un <Link transitionTypes>
 * marcó como ida o vuelta.
 */
const DIRECTIONAL = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONAL} exit={DIRECTIONAL} default="none">
      {children}
    </ViewTransition>
  );
}
