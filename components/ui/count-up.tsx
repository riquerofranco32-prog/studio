"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Anima sólo el primer número entero que encuentra en `value` (p.ej. "6" en
// "6", "100" en "100%") y deja el resto del string (prefijo/sufijo) fijo. Si
// no hay ningún número (p.ej. "2025–2026"), se renderiza tal cual, sin animar.
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2], 10) : null;
  const suffix = match?.[3] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(target !== null ? "0" : value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // ponytail: dependencias primitivas a propósito. `value.match(...)` crea
    // un array nuevo en cada render, y ese array como dependencia hacía que
    // cada setDisplay() (llamado ~60 veces/seg por la animación) reiniciara
    // el efecto — parar y volver a arrancar desde 0 en cada frame, dejando
    // el número pegado cerca del arranque. `target` es un número, estable.
    if (target === null || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (reduceMotion) {
      setDisplay(String(target));
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [isInView, target, reduceMotion]);

  if (target === null) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
