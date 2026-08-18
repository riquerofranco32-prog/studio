"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/**
 * `prefers-reduced-motion`, seguro para hidratación y sin efectos.
 *
 * Se prefiere al `useReducedMotion` de framer-motion porque aquel devuelve
 * `boolean | null` (null hasta que monta, lo que hacía montar el shader un
 * frame de más) y no se actualiza si la preferencia cambia con la página
 * abierta.
 *
 * Cubre sólo lo que framer no puede: las MotionValues escritas a mano
 * (`mouseX.set`, `useSpring`, `useTransform` sobre el scroll) no pasan por el
 * pipeline de animación, así que <MotionProvider> no las ve. Todo lo que use
 * `animate`/`initial` ya queda cubierto allá.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
