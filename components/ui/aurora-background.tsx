"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function AuroraBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
      {/* Orb Superior Izquierdo (Acento) */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-radial from-accent/25 via-accent/5 to-transparent blur-[120px]"
      />

      {/* Orb Inferior Derecho */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-radial from-[#ff7a59]/15 via-transparent to-transparent blur-[140px]"
      />
    </div>
  );
}
