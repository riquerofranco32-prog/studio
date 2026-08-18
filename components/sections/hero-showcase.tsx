"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, MotionValue } from "framer-motion";
import { MD, useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Project } from "@/types";

/**
 * Cuántas tarjetas reproducen video debajo de `md`.
 *
 * Está acá arriba y como constante porque es una decisión de performance que se
 * tomó con números, no una preferencia: ver la tabla de la medición en el
 * mensaje del commit. Cambiarla es cambiar cuántos decodificadores de hardware
 * pide la página en un teléfono.
 */
const MOBILE_VIDEO_COUNT = 1;

/**
 * Fila de productos del hero.
 *
 * La grilla se arma con la cantidad de proyectos que reciba, así que aguanta 3
 * o 4 sin tocar nada. En mobile pasa a ser un scroller horizontal con snap: 4
 * columnas en 390px darían tarjetas de 80px, ilegibles.
 */
export function HeroShowcase({
  projects,
  y,
}: {
  projects: Project[];
  /** Parallax vertical. Ya viene gateado por reduced-motion desde el hero. */
  y?: MotionValue<string>;
}) {
  const esDesktop = useMediaQuery(MD);
  const reduceMotion = useReducedMotion();

  // Los clips se montan recién después del primer pintado. Los bytes se bajan
  // igual —- autoplay ignora `preload`, está medido —- pero dejan de competir
  // con las fuentes y el JS por el primer render. Hasta entonces se ve el
  // <Image>, que ya está optimizado y es lo que el visitante mira primero.
  const [montarVideo, setMontarVideo] = useState(false);
  useEffect(() => {
    const idle =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => setMontarVideo(true), { timeout: 2000 })
        : window.setTimeout(() => setMontarVideo(true), 300);
    return () => {
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, []);

  return (
    <motion.div
      data-hero-cards
      style={{
        gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))`,
        ...(y ? { y } : {}),
      }}
      className="
        flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        md:grid md:snap-none md:overflow-visible md:pb-0
      "
    >
      {projects.map((project, i) => {
        // Debajo de md sólo las primeras N reproducen; el resto queda en la
        // imagen. Con reduced-motion no reproduce ninguna.
        const conVideo =
          !reduceMotion &&
          montarVideo &&
          Boolean(project.video) &&
          (esDesktop || i < MOBILE_VIDEO_COUNT);

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            transitionTypes={["nav-forward"]}
            className="focus-ring group w-[85vw] shrink-0 snap-start md:w-auto"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface">
              {/* Capa base: el <Image> de Next, que sirve AVIF al ancho real.
                  Reemplaza al atributo `poster`, que baja el JPG crudo y sin
                  redimensionar — medido, 289 KB contra 21.6 KB. */}
              <Image
                src={project.image}
                alt={`${project.name} preview`}
                fill
                sizes="(min-width: 768px) 33vw, 85vw"
                className="object-cover object-top"
              />

              {conVideo && project.video && (
                <video
                  aria-hidden
                  autoPlay
                  muted
                  loop
                  playsInline
                  // Sin `poster`: debajo ya está el <Image>. Sin `preload`
                  // tampoco: con autoplay el navegador lo ignora, medido.
                  onCanPlay={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500"
                >
                  <source src={project.video.webm} type="video/webm" />
                  <source src={project.video.mp4} type="video/mp4" />
                </video>
              )}

              <span className="absolute inset-0 z-10 bg-background/0 transition-colors duration-500 group-hover:bg-background/20" />
            </div>

            <p className="mt-3 flex items-baseline gap-2.5 text-sm">
              <span className="font-mono text-xs text-muted">{project.number}</span>
              <span className="text-foreground transition-colors duration-300 group-hover:text-accent">
                {project.name}
              </span>
            </p>
          </Link>
        );
      })}
    </motion.div>
  );
}
