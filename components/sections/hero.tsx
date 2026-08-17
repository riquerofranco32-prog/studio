"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Marquee } from "@/components/ui/marquee";
import { capabilities } from "@/data/services";

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

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-16"
    >
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
        <p
          className="hero-rise mb-8 flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted uppercase"
          style={{ animationDelay: SEQUENCE.kicker }}
        >
          <span className="relative flex h-2 w-2">
            {!reduceMotion && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Disponibles para nuevos proyectos
        </p>

        <h1 className="display max-w-3xl text-[2.6rem] text-foreground sm:max-w-4xl sm:text-6xl md:max-w-6xl md:text-[6.5rem]">
          <span className="block overflow-hidden">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line1 }}
            >
              Construimos
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line2 }}
            >
              experiencias digitales
            </span>
          </span>
          <span className="block overflow-hidden">
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
            <ButtonLink href="/#contact">
              Iniciar un proyecto
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <ButtonLink href="/#work" variant="secondary">
              Ver nuestro trabajo
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </ButtonLink>
          </div>
        </div>
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
