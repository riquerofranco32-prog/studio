"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { projects } from "@/data/projects";

// Muro tipo John Moore: filas de palabras gigantes de fondo + una imagen que
// escala con el scroll, a modo de puente hacia "Trabajo seleccionado".
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

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1, 1.3]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.85, 1],
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
              className="display whitespace-nowrap px-6 text-[9vw] leading-none text-foreground"
            >
              {word.repeat(4)}
            </span>
          ))}
        </div>
        <Link
          href={`/work/${featured.slug}`}
          className="focus-ring group relative mx-auto block aspect-video w-[80vw] max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl"
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
    <section ref={rootRef} className="relative h-[260vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden border-y border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.06]"
        >
          {WALL_WORDS.map((word, i) => (
            <Marquee key={word} duration={22 + i * 6}>
              <span className="display whitespace-nowrap px-6 text-[9vw] leading-none text-foreground">
                {word}
              </span>
            </Marquee>
          ))}
        </div>

        <motion.div
          style={{ scale, opacity, borderRadius: radius }}
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
