"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "@/lib/use-in-view";

export function RevealText({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: visible ? "0%" : "110%" }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}
