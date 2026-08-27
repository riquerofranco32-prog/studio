"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Desactivar en pantallas táctiles
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setMounted(true);

    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Buscar texto contextual en el elemento o sus padres
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;
      if (textEl) {
        setCursorText(textEl.getAttribute("data-cursor-text"));
      } else {
        setCursorText(null);
      }

      // Detectar elementos clickeables
      const clickEl = target.closest("a, button, input, textarea, select, [role='button']");
      setIsPointer(Boolean(clickEl) && !textEl);
    }

    function handleMouseLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, visible]);

  if (!mounted || reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Halo Seguidor Suave */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: cursorText ? 1 : isPointer ? 1.5 : 1,
          width: cursorText ? "auto" : isPointer ? 44 : 32,
          height: cursorText ? 36 : isPointer ? 44 : 32,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-center rounded-full border transition-colors ${
          cursorText
            ? "border-accent bg-accent text-background px-3.5 shadow-[0_0_25px_rgba(255,77,46,0.4)]"
            : isPointer
            ? "border-accent/80 bg-accent/15 backdrop-blur-[2px]"
            : "border-foreground/20 bg-foreground/5 backdrop-blur-[1px]"
        }`}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[11px] font-bold tracking-wider uppercase whitespace-nowrap"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Punto Central Exacto (si no hay texto activo) */}
      {!cursorText && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: isPointer ? 0 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="h-1.5 w-1.5 rounded-full bg-accent"
        />
      )}
    </div>
  );
}
