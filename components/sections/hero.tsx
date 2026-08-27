"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Marquee } from "@/components/ui/marquee";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroShowcase } from "@/components/sections/hero-showcase";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { capabilities } from "@/data/services";
import { projects } from "@/data/projects";
import { LiveClock } from "@/components/ui/live-clock";
import { Star } from "lucide-react";

// La entrada del hero es una secuencia de CSS puro (ver .hero-line/.hero-rise en
// globals.css) en vez de una timeline de GSAP: mismo resultado, sin la librería
// en el bundle. El paralaje sí necesita JS y usa framer-motion, que ya está acá
// por el navbar, las tarjetas y RevealText.
const SEQUENCE = {
  kicker: "0.05s",
  line1: "0.35s",
  line2: "0.55s",
  line3: "0.75s",
  sub: "1.05s",
  cta: "1.2s",
  ticker: "1.4s",
};

/**
 * Los proyectos que se muestran arriba, en el orden de data/projects.ts. La
 * lista se filtra por los que tienen clip: agregar apex-ai es agregarle el
 * campo `video` y aparece solo, sin tocar layout — la grilla se arma con la
 * cantidad que reciba.
 */
const SHOWCASE = [...projects]
  .sort((a, b) => a.order - b.order)
  .slice(0, 4);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  // El paralaje escribe una MotionValue a mano, así que no pasa por el gate de
  // <MotionProvider> y necesita el suyo. El hook propio (useSyncExternalStore)
  // resuelve false en servidor y en el primer render del cliente, así que la
  // hidratación coincide sin el useState + useEffect que había acá.
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  // Sentido opuesto al del grid: el diferencial se lee sin que ninguna de las
  // dos capas viaje mucho.
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  // Sin min-h-[100svh] a propósito: con la fila de productos el hero mide
  // ~1150px y no entra en una pantalla. En vez de achicar las tarjetas o el
  // titular, el corte se diseña — las tarjetas asoman cortadas por abajo, que
  // es lo que invita a scrollear. Un hero que entra exacto no da ninguna
  // razón para bajar.
  return (
    <section
      ref={rootRef}
      className="relative flex flex-col overflow-hidden pt-28 pb-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] opacity-40"
      />
      {/* Resplandor de acento: única fuente de color del hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[560px] w-[560px] rounded-full bg-accent/[0.09] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-foreground/[0.03] blur-3xl"
      />

      {/* En mobile el titular ocupa casi todo el alto: centrar recortaría la primera
          línea detrás del navbar, así que el contenido arranca arriba y sólo se
          centra cuando hay aire de sobra. */}
      <Container className="relative flex flex-1 flex-col justify-start md:justify-center">
        <div
          className="hero-rise mb-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: SEQUENCE.kicker }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              {!reduceMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-foreground font-medium">Estudio Abierto</span>
            <span className="text-border">·</span>
            <span className="hidden sm:inline">Patagonia AR</span>
            <LiveClock className="text-foreground" />
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-xs text-muted sm:inline-flex">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-foreground font-medium">5.0</span>
            <span className="text-muted">· 6+ Productos Shipped</span>
          </div>
        </div>

        <h1 className="display max-w-3xl text-[2.6rem] text-foreground sm:max-w-4xl sm:text-6xl md:max-w-6xl md:text-[6.5rem]">
          <span className="line-mask block">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line1 }}
            >
              Construimos
            </span>
          </span>
          <span className="line-mask block">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line2 }}
            >
              experiencias digitales
            </span>
          </span>
          <span className="line-mask block">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line3 }}
            >
              para marcas que <span className="text-accent">avanzan.</span>
            </span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            className="hero-rise max-w-md text-lg leading-relaxed text-muted md:text-xl"
            style={{ animationDelay: SEQUENCE.sub }}
          >
            Estrategia, diseño y tecnología — desde la primera idea hasta el
            producto final.
          </p>

          <div
            className="hero-rise flex flex-wrap items-center gap-3"
            style={{ animationDelay: SEQUENCE.cta }}
          >
            <Magnetic>
              <ButtonLink href="/#contact">
                Iniciar un proyecto
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/#work" variant="secondary">
                Ver nuestro trabajo
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </Container>

      <Container className="relative mt-14">
        <HeroShowcase
          projects={SHOWCASE}
          y={reduceMotion ? undefined : cardsY}
        />
      </Container>

      <div
        className="hero-rise relative mt-16 border-y border-border py-5"
        style={{ animationDelay: SEQUENCE.ticker }}
      >
        <Marquee duration={45}>
          {capabilities.map((item) => (
            <span
              key={item}
              className="flex items-center gap-8 pr-8 font-mono text-xs tracking-widest text-muted uppercase"
            >
              {item}
              <span className="text-accent">/</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
