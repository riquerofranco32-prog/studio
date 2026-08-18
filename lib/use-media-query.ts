"use client";

import { useCallback, useSyncExternalStore } from "react";

// Una MediaQueryList por query para toda la app: getSnapshot corre en cada
// render y crear una nueva cada vez es basura gratis.
const cache = new Map<string, MediaQueryList>();
function mq(query: string) {
  let m = cache.get(query);
  if (!m) {
    m = window.matchMedia(query);
    cache.set(query, m);
  }
  return m;
}

/**
 * Media query como estado de React, seguro para hidratación y sin efectos.
 *
 * El servidor no puede conocer el viewport ni las preferencias del sistema, así
 * que devuelve `false` y React usa ese mismo snapshot para el primer render del
 * cliente: servidor e hidratación coinciden por construcción, y se corrige solo
 * al terminar de hidratar. Ese `false` inicial es el motivo por el que todo lo
 * que dependa de esto tiene que degradar hacia "sin movimiento", nunca hacia
 * "con movimiento".
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const m = mq(query);
      m.addEventListener("change", onStoreChange);
      return () => m.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => mq(query).matches,
    () => false,
  );
}

/** Breakpoint `md` de Tailwind — el mismo en el que la grilla pasa a 2 columnas. */
export const MD = "(min-width: 768px)";

/** Punteros sin hover fino: touch. Nada magnético ni de cursor tiene sentido acá. */
export const COARSE_POINTER = "(pointer: coarse)";
