"use client";

import { ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import { DUR, EASE, STAGGER } from "@/lib/motion";

/**
 * Reveal por viewport: fade + subida corta, una sola vez.
 *
 * Es el reveal por defecto del sitio — tarjetas, bloques, filas. Para titulares
 * en escala display existe <RevealText>, que enmascara la línea entera en vez
 * de moverla.
 *
 * Los números están fijos a propósito: 16px en 0.55s con la curva del sistema.
 * 16px lee como peso; recorridos más largos a la misma duración se leen lentos
 * y el elemento parece flotar en vez de asentarse.
 *
 * No lleva gate de reduced-motion propio: `y` es una clave posicional, así que
 * <MotionProvider> (reducedMotion="user") la descarta y deja sólo el fade.
 */
export function Reveal({
  children,
  /** Posición en la cascada. El delay sale de acá: `index * 90ms`. */
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.15);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: DUR.base,
        ease: EASE,
        delay: visible ? index * STAGGER : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
