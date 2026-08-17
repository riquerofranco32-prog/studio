"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useInView } from "@/lib/use-in-view";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Project } from "@/types";

export function ProjectCard({
  project,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  /** Ancho real que ocupa la tarjeta — lo define el layout de la grilla. */
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.15);

  // El spotlight escribe MotionValues a mano, así que <MotionProvider> no lo
  // toca: un elemento que persigue el cursor es justo lo que la preferencia
  // pide evitar, y hay que apagarlo acá. Mismo criterio que el retrato del
  // roster en team-roster.tsx.
  const reduceMotion = useReducedMotion();

  // Spotlight que sigue el cursor: sólo mueve dos motion values, sin spring
  // (el gradiente en sí ya "suaviza" el movimiento visualmente). El rect se
  // cachea en mouseenter en vez de leerlo en cada mousemove — getBoundingClientRect
  // fuerza layout, y un mousemove dispara decenas de eventos por segundo.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rectRef = useRef<DOMRect | null>(null);
  const spotlightBackground = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, var(--accent-soft), transparent 70%)`;

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = rectRef.current;
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link href={`/work/${project.slug}`} className="focus-ring group block">
        <div
          onMouseEnter={reduceMotion ? undefined : handleMouseEnter}
          onMouseMove={reduceMotion ? undefined : handleMouseMove}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface"
        >
          {!reduceMotion && (
            <motion.div
              aria-hidden
              style={{ background: spotlightBackground }}
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted/60">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.name} preview`}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              {project.name}
            </span>
          </div>

          {/* Velo inferior: sostiene la etiqueta "Ver caso" al hacer hover. */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1.5 font-mono text-[11px] tracking-wide text-foreground backdrop-blur-md">
            {project.year}
          </span>

          <span className="absolute right-4 top-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-accent text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>

          <span className="absolute bottom-5 left-5 translate-y-3 text-sm font-medium text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Ver caso de estudio →
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted">
                {project.number}
              </span>
              <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
                {project.name}
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted">{project.category}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
