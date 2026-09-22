"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Paleta de marca para el shader: negro de fondo + el acento naranja en dos
// intensidades + un toque de foreground para las luces altas. Nada de
// violeta — un solo acento, igual que el resto del sitio.
const MESH_COLORS = ["#0a0a0b", "#ff4d2e", "#0a0a0b", "#3a140a", "#0a0a0b"];

// Fondo con más peso visual para el Hero: mesh gradient real (WebGL, misma
// librería del ejemplo que pasó el usuario) + una grilla que se dibuja al
// entrar, con acentos en las esquinas. En la paleta de marca y con
// framer-motion para la grilla, en vez de manipular el DOM a mano.
export function HeroMesh() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  // El shader corre en WebGL a 60fps mientras esté montado — costoso incluso
  // scrolleado lejos del hero, que es la mayor parte de la sesión en una
  // landing de una sola página larga. Se desmonta fuera de viewport y se
  // vuelve a montar al volver, igual que hace phosphor-shader.tsx.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        rootMargin: "200px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {reduceMotion ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,77,46,0.12),transparent_60%)]" />
      ) : inView ? (
        <MeshGradient
          className="absolute inset-0 h-full w-full opacity-50"
          colors={MESH_COLORS}
          speed={0.25}
          distortion={0.85}
          swirl={0.35}
        />
      ) : null}

      {/* Grilla que se dibuja al entrar */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.5]">
        <motion.line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          stroke="var(--border)"
          strokeWidth="1"
          initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
          animate={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        />
        <motion.line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          stroke="var(--border)"
          strokeWidth="1"
          initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
          animate={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Puntos de acento en las esquinas */}
      {[
        "left-8 top-8",
        "right-8 top-8",
        "left-8 bottom-8",
        "right-8 bottom-8",
      ].map((position, i) => (
        <motion.span
          key={position}
          className={`absolute ${position} h-1.5 w-1.5 rounded-full bg-accent/40`}
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
        />
      ))}
    </div>
  );
}
