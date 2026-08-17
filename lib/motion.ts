/**
 * Tokens de motion para framer-motion — espejo exacto de las variables de
 * app/globals.css.
 *
 * Existen dos veces porque framer-motion no resuelve `var(--ease)`: necesita
 * la curva como tupla de números y la duración como segundos. Si cambia una,
 * cambia la otra; el comentario en globals.css apunta acá y viceversa.
 */

/** cubic-bezier(0.22, 1, 0.36, 1) — la única curva del sistema. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Segundos, para el prop `transition` de framer-motion. */
export const DUR = {
  /** 0.4s — color, chips, estados chicos. */
  fast: 0.4,
  /** 0.55s — reveal de una tarjeta o un bloque. */
  base: 0.55,
  /** 0.7s — reveal de una línea de texto. */
  slow: 0.7,
  /** 0.9s — entrada del hero. */
  hero: 0.9,
} as const;

/** 90ms entre hermanos, en segundos: `delay: i * STAGGER`. */
export const STAGGER = 0.09;
