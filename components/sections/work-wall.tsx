"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { projects } from "@/data/projects";
import { capabilities } from "@/data/services";

// Cierre del Hero, estilo John Moore: titular + tags que se revelan y un
// proyecto real que crece hasta ocupar la pantalla, con un muro de palabras
// de fondo. Puente hacia "Trabajo seleccionado".
const WALL_WORDS = [
  "DISEÑO",
  "DESARROLLO",
  "E-COMMERCE",
  "INTELIGENCIA ARTIFICIAL",
  "PERFORMANCE",
  "IDENTIDAD DE MARCA",
];

export function WorkWall() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const featured = projects.find((p) => p.order === 1) ?? projects[0];

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [0.4, 1, 1.3]);
  const radius = useTransform(scrollYProgress, [0, 0.55, 1], [9999, 28, 0]);
  // Arranca a aparecer recién en 0.4: el intro (texto + tags) ya terminó de
  // desvanecerse en 0.3, así que hay un margen de 0.1 donde ninguno de los
  // dos está visible en vez de superponerse (bug: quedaban 0.2→0.35 los dos
  // en pantalla a la vez, texto encima de la card).
  const videoOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.85, 1],
    [0, 1, 1, 0],
  );

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.2, 0.3],
    [0, 1, 1, 0],
  );
  const introY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const tagsOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.16, 0.2, 0.3],
    [0, 1, 1, 0],
  );

  // Sin scroll pin bajo reduced-motion: una franja quieta con la misma idea,
  // sin el mareo de un elemento fijo que crece mientras el usuario scrollea.
  if (reduceMotion) {
    return (
      <section className="relative overflow-hidden border-y border-border bg-background py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.06]"
        >
          {WALL_WORDS.map((word) => (
            <span
              key={word}
              className="display whitespace-nowrap px-6 text-[min(9vw,12vh)] leading-none text-foreground"
            >
              {word.repeat(4)}
            </span>
          ))}
        </div>

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="display text-3xl text-foreground sm:text-4xl">
            Así construimos.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-muted"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/work/${featured.slug}`}
          className="focus-ring group relative mx-auto mt-12 block aspect-video w-[80vw] max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl"
        >
          <Image
            src={featured.image}
            alt={featured.name}
            fill
            sizes="80vw"
            className="object-cover"
          />
        </Link>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[340vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden border-y border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.06]"
        >
          {WALL_WORDS.map((word, i) => (
            <Marquee key={word} duration={22 + i * 6}>
              {/* min() con vh: en pantallas bajas las 6 filas no entraban en
                  el h-screen y la última quedaba cortada. */}
              <span className="display whitespace-nowrap px-6 text-[min(9vw,12vh)] leading-none text-foreground">
                {word}
              </span>
            </Marquee>
          ))}
        </div>

        {/* Titular y tags que se revelan antes de que el video crezca */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute z-10 mx-auto max-w-2xl px-6 text-center"
        >
          <h2 className="display text-3xl text-foreground sm:text-4xl md:text-5xl">
            Así construimos.
          </h2>
          <motion.div
            style={{ opacity: tagsOpacity }}
            className="mt-6 flex flex-wrap justify-center gap-2.5"
          >
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-foreground"
              >
                {cap}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ scale, opacity: videoOpacity, borderRadius: radius }}
          className="relative aspect-video w-[70vw] max-w-3xl overflow-hidden border border-border shadow-2xl"
        >
          <Image
            src={featured.image}
            alt={featured.name}
            fill
            sizes="70vw"
            className="object-cover"
          />
          <Link
            href={`/work/${featured.slug}`}
            className="focus-ring group absolute inset-0 flex items-end justify-between bg-gradient-to-t from-background/80 via-transparent to-transparent p-6"
          >
            <span className="text-lg font-medium text-foreground">
              {featured.name}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
