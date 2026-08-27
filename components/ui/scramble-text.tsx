"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";

export function ScrambleText({
  text,
  className = "",
  triggerOnHover = true,
  speed = 30,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isAnimating = useRef(false);
  const reduceMotion = useReducedMotion();

  const startScramble = useCallback(() => {
    if (reduceMotion || isAnimating.current) return;
    isAnimating.current = true;
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isAnimating.current = false;
      }

      iteration += 1 / 2;
    }, speed);
  }, [text, speed, reduceMotion]);

  useEffect(() => {
    if (isInView) {
      startScramble();
    }
  }, [isInView, startScramble]);

  return (
    <span
      ref={ref}
      onMouseEnter={triggerOnHover ? startScramble : undefined}
      className={`inline-block ${className}`}
    >
      {displayText}
    </span>
  );
}
