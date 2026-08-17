"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Una sola MediaQueryList para toda la app: getSnapshot corre en cada render y
// crear una nueva cada vez es basura gratis.
let mediaQuery: MediaQueryList | null = null;
function mq() {
  if (!mediaQuery) mediaQuery = window.matchMedia(QUERY);
  return mediaQuery;
}

function subscribe(onStoreChange: () => void) {
  const m = mq();
  m.addEventListener("change", onStoreChange);
  return () => m.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => mq().matches;

// El servidor no puede conocer la preferencia, así que asume "no reducir".
// React usa este mismo snapshot para el primer render del cliente, con lo cual
// servidor e hidratación coinciden y después se corrige solo — que es lo que
// antes se resolvía con un useState + useEffect, el patrón que disparaba
// react-hooks/set-state-in-effect.
const getServerSnapshot = () => false;

/**
 * `prefers-reduced-motion`, seguro para hidratación y sin efectos.
 *
 * Se prefiere al `useReducedMotion` de framer-motion porque aquel devuelve
 * `boolean | null` (null hasta que monta) y no se actualiza si la preferencia
 * cambia con la página abierta.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
