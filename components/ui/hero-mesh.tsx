"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Fondo con más peso visual para el Hero: blobs de acento que derivan
// lentamente (mesh gradient "vivo") + una grilla que se dibuja al entrar,
// con acentos en las esquinas. Mismo espíritu que los ejemplos que pasó el
// usuario (mesh gradient animado + grilla con líneas y puntos que aparecen),
// pero en la paleta de marca (un solo acento naranja) y con framer-motion en
// vez de manipular el DOM a mano.
export function HeroMesh() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Blobs de acento a la deriva */}
      <motion.div
        className="absolute -right-40 top-[-10%] h-[620px] w-[620px] rounded-full bg-accent/[0.14] blur-[150px]"
        animate={
          reduceMotion ? undefined : { x: [0, -40, 20, 0], y: [0, 30, -20, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-32 bottom-[-15%] h-[480px] w-[480px] rounded-full bg-accent/[0.08] blur-[130px]"
        animate={
          reduceMotion ? undefined : { x: [0, 30, -20, 0], y: [0, -25, 15, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/4 h-[360px] w-[360px] rounded-full bg-foreground/[0.035] blur-[110px]"
        animate={
          reduceMotion ? undefined : { x: [0, -20, 25, 0], y: [0, 20, -15, 0] }
        }
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

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
