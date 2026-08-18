"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "@/lib/use-in-view";
import { DUR, EASE, STAGGER } from "@/lib/motion";

/**
 * Reveal de titulares: la línea entera sube desde detrás de una máscara, en vez
 * del fade + 16px de <Reveal>. Se reserva para la escala display — en texto
 * chico el enmascarado se lee como un glitch, no como intención.
 *
 * El movimiento es `y`, una clave posicional, así que <MotionProvider> lo
 * descarta bajo reduced-motion y el texto aparece en su lugar sin viajar.
 */
export function RevealText({
  children,
  index = 0,
}: {
  children: ReactNode;
  /** Posición en la cascada. El delay sale de acá: index * 90ms. */
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div ref={ref} className="line-mask">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: visible ? "0%" : "110%" }}
        transition={{ duration: DUR.slow, delay: index * STAGGER, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
