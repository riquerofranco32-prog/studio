"use client";

import { ReactNode, MouseEvent, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { COARSE_POINTER, useMediaQuery } from "@/lib/use-media-query";

/** Cuánto del recorrido del cursor sigue el elemento. */
const FACTOR = 0.25;
/** Tope del desplazamiento, en px. Sin esto un botón chico viaja demasiado. */
const MAX = 12;
/** Margen alrededor del elemento donde ya empieza a atraer. */
const PADDING = 24;
const SPRING = { stiffness: 200, damping: 15, mass: 0.3 };

/**
 * Envoltorio magnético: el contenido se corre hacia el cursor y vuelve al
 * soltarlo.
 *
 * Envuelve `children` en vez de renderizar su propio <Link>, que es lo que
 * hacía la versión anterior (components/ui/magnetic-link.tsx) — así puede
 * envolver a <ButtonLink> sin duplicar sus variantes de estilo.
 *
 * La posición vive en MotionValues, no en estado de React. La versión anterior
 * llamaba a setState en cada mousemove, o sea un re-render del árbol a ~60 por
 * segundo para mover dos números. Es el mismo patrón que ya usaba el retrato
 * del roster.
 *
 * Se apaga con reduced-motion y en punteros gruesos: sin hover el efecto no
 * existe, y dejar los listeners puestos en touch sólo gasta.
 */
export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const coarsePointer = useMediaQuery(COARSE_POINTER);
  const disabled = reduceMotion || coarsePointer;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  function handleMouseMove(event: MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v * FACTOR));
    x.set(clamp(dx));
    y.set(clamp(dy));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  if (disabled) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        // El área sensible se agranda con padding negativo en el margen: el
        // elemento atrae desde PADDING px antes de que el cursor lo toque, sin
        // ocupar más lugar en el layout.
        margin: -PADDING,
        padding: PADDING,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
