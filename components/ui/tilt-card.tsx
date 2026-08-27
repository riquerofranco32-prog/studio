"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scaleHover?: number;
  cursorText?: string;
}

export function TiltCard({
  children,
  className = "",
  maxAngle = 8,
  scaleHover = 1.02,
  cursorText,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.4 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxAngle, -maxAngle]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxAngle, maxAngle]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    x.set(clientX / rect.width);
    y.set(clientY / rect.height);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  }

  if (reduceMotion) {
    return (
      <div className={className} data-cursor-text={cursorText}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-text={cursorText}
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scaleHover : 1,
        }}
        transition={{ duration: 0.2 }}
        className="w-full h-full"
      >
        {children}

        {/* Resplandor especular dinámico */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${smoothX.get() * 100}% ${smoothY.get() * 100}%, rgba(255,255,255,0.3), transparent 80%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
