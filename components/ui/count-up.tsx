"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/motion";

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
  const [tween, setTween] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    // ponytail: dependencias primitivas a propósito. `value.match(...)` crea
    // un array nuevo en cada render, y ese array como dependencia hacía que
    // cada setTween() (llamado ~60 veces/seg por la animación) reiniciara
    // el efecto — parar y volver a arrancar desde 0 en cada frame, dejando
    // el número pegado cerca del arranque. `target` es un número, estable.
    if (target === null || !isInView || reduceMotion || hasAnimated.current) {
      return;
    }
    hasAnimated.current = true;

    const controls = animate(0, target, {
      // Fuera de la escala 0.4–0.9s a propósito: un contador no es un reveal,
      // necesita tiempo para que el número se lea mientras sube.
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setTween(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [isInView, target, reduceMotion]);

  if (target === null) return <span ref={ref}>{value}</span>;

  // Con reduced-motion el número final se deriva en el render, no se setea
  // desde el efecto: el efecto ni siquiera corre. Además de sacar el setState
  // síncrono en efecto, ahorra un render para mostrar algo que nunca se anima.
  const display = reduceMotion ? String(target) : tween;

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
