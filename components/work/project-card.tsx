"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, ViewTransition } from "react";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { MD, useMediaQuery } from "@/lib/use-media-query";
import { Project } from "@/types";

export function ProjectCard({
  project,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
  index = 0,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  /** Ancho real que ocupa la tarjeta — lo define el layout de la grilla. */
  sizes?: string;
  /** Posición dentro de su fila de la grilla, para escalonar el reveal. */
  index?: number;
}) {
  // Debajo de md la grilla colapsa a una columna y cada tarjeta entra sola:
  // ahí el escalonado no escalona nada, es latencia pura después de que la
  // tarjeta ya está en pantalla. Mismo criterio que usar i % 2 en vez de i.
  const esDesktop = useMediaQuery(MD);
  const cascada = esDesktop ? index : 0;

  // El spotlight escribe MotionValues a mano, así que <MotionProvider> no lo
  // toca: un elemento que persigue el cursor es justo lo que la preferencia
  // pide evitar, y hay que apagarlo acá. Mismo criterio que el retrato del
  // roster en team-roster.tsx.
  const reduceMotion = useReducedMotion();

  // El clip sólo existe si hay archivos, hay hover de verdad y nadie pidió
  // menos movimiento. Sin clip la tarjeta se queda con el JPG, que es el
  // estado por defecto y el que se ve hoy.
  const videoRef = useRef<HTMLVideoElement>(null);
  const conVideo = Boolean(project.video) && esDesktop && !reduceMotion;

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
    // play() devuelve una promesa que rechaza si el cursor se va antes de que
    // el clip esté listo. Es esperable, no un error: se traga.
    videoRef.current?.play().catch(() => {});
  }

  function handleMouseLeave() {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    // Volver a 0 para que el próximo hover empiece el loop desde el principio
    // en vez de retomarlo por la mitad.
    v.currentTime = 0;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = rectRef.current;
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <Reveal index={cascada} className={className}>
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["nav-forward"]}
        className="focus-ring group block"
      >
        <div
          onMouseEnter={reduceMotion ? undefined : handleMouseEnter}
          onMouseMove={reduceMotion ? undefined : handleMouseMove}
          onMouseLeave={conVideo ? handleMouseLeave : undefined}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,transform] duration-500 ease-out group-hover:border-foreground/20 motion-safe:group-hover:-translate-y-1"
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
              // El nombre tiene que ser el mismo acá y en el hero del caso de
              // estudio: es lo que le dice a React que son el mismo objeto.
              // `default="none"` evita que esta imagen haga su propio crossfade
              // en cualquier transición ajena, y `share="morph"` es obligatorio
              // junto con él — sin share explícito el par deja de morphear en
              // silencio (doc local: view-transitions.md).
              <ViewTransition
                name={`project-${project.slug}`}
                share="morph"
                default="none"
              >
                <Image
                  src={project.image}
                  alt={`${project.name} preview`}
                  fill
                  priority={priority}
                  sizes={sizes}
                  className="object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </ViewTransition>
            ) : null}
            {conVideo && project.video && (
              // preload="none": no baja un byte hasta el primer hover.
              <video
                ref={videoRef}
                aria-hidden
                muted
                loop
                playsInline
                preload="none"
                // Sin `poster`: debajo ya está el <Image> de Next con AVIF y
                // el ancho correcto. El atributo bajaría además el JPG crudo —
                // medido, 289 KB contra 21.6 KB para las mismas tres tarjetas.
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <source src={project.video.webm} type="video/webm" />
                <source src={project.video.mp4} type="video/mp4" />
              </video>
            )}

            <span className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              {project.name}
            </span>
          </div>

          {/* Velo inferior: sostiene la pastilla "Ver caso" al hacer hover. */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />

          <span className="absolute bottom-4 left-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            Ver caso
            <ArrowUpRight size={14} />
          </span>
        </div>

        {/* Metadata en el mismo orden en todas las tarjetas: número · categoría
            · año, después nombre, bajada y el dato del proyecto si existe. */}
        <div className="mt-5 flex items-center justify-between gap-4 font-mono text-[11px] tracking-wide text-muted uppercase">
          <span className="min-w-0 truncate">
            <span className="text-accent">{project.number}</span>
            <span className="mx-2 text-border">/</span>
            {project.category}
          </span>
          <span className="shrink-0">{project.year}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
            {project.name}
          </h3>
          <span
            aria-hidden
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background motion-safe:group-hover:rotate-45"
          >
            <ArrowUpRight size={15} />
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>
        {project.impactMetric && (
          <span className="mt-4 inline-flex rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
            {project.impactMetric}
          </span>
        )}
      </Link>
    </Reveal>
  );
}
