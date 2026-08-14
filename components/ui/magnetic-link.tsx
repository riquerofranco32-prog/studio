"use client";

import Link from "next/link";
import { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

export function MagneticLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.25, y: y * 0.25 });
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 });
  }

  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.span
      className="inline-block"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.3 }}
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`focus-ring inline-flex items-center gap-2 ${className}`}
        {...props}
      >
        {children}
      </Link>
    </motion.span>
  );
}
