"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Gate global de `prefers-reduced-motion` para framer-motion.
 *
 * El bloque de reduced-motion de globals.css sólo alcanza a `animation` y
 * `transition` de CSS. framer-motion anima escribiendo estilos inline, así que
 * no pasaba por ahí: hasta acá, el reveal de las tarjetas, el de RevealText, el
 * paso del Proceso y el menú mobile corrían enteros aunque el sistema pidiera
 * menos movimiento.
 *
 * `reducedMotion="user"` no apaga todo: framer descarta sólo las claves
 * "posicionales" — los transforms más width/height/top/left/right/bottom, que
 * saltan directo al valor final — y deja animando opacidad y color. Es la
 * lectura correcta de la preferencia: sin movimiento, no sin interfaz.
 *
 * Ojo con lo que esto NO cubre: las MotionValues que se setean a mano
 * (`mouseX.set(...)`, `useSpring`, `useTransform` sobre el scroll) no pasan por
 * el pipeline de animación, así que necesitan su propio gate en el componente.
 * Hoy los tienen el paralaje del hero, el retrato del roster y el spotlight de
 * las tarjetas.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
