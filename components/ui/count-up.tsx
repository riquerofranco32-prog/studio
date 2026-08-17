"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Anima sólo el primer número entero que encuentra en `value` (p.ej. "6" en
// "6", "100" en "100%") y deja el resto del string (prefijo/sufijo) fijo. Si
// no hay ningún número (p.ej. "2025–2026"), se renderiza tal cual, sin animar.
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!match || !isInView) return;
    const target = parseInt(match[2], 10);
    if (reduceMotion) {
      setDisplay(match[2]);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [isInView, match, reduceMotion]);

  if (!match) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
}
