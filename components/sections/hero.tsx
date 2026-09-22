"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Marquee } from "@/components/ui/marquee";
import { Magnetic } from "@/components/ui/magnetic";
import { BuildConsole } from "@/components/ui/build-console";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/motion";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

const SEQUENCE = {
  kicker: "0.05s",
  line1: "0.35s",
  line2: "0.55s",
  sub: "1.05s",
  cta: "1.2s",
  console: "1.15s",
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

  const clientBrands = [...projects].sort((a, b) => a.order - b.order);

  // Preview circular que sigue al cursor al pasar por la marquesina: el
  // clip-path arranca en un punto y se abre a un rectángulo redondeado,
  // versión con framer-motion (sin GSAP) de un reveal circular por scroll.
  const [hovered, setHovered] = useState<Project | null>(null);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const springX = useSpring(previewX, { damping: 25, stiffness: 300 });
  const springY = useSpring(previewY, { damping: 25, stiffness: 300 });

  function handleMarqueeMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    previewX.set(e.clientX);
    previewY.set(e.clientY);
  }

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex flex-col overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] opacity-40"
      />
      {/* Resplandor de acento sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[560px] w-[560px] rounded-full bg-accent/[0.09] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-foreground/[0.03] blur-3xl"
      />

      <Container className="relative flex flex-1 flex-col justify-start md:justify-center">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
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
                <span className="text-foreground font-medium">
                  Estudio Abierto
                </span>
                <span className="text-border">·</span>
                <span>Patagonia AR</span>
              </div>
            </div>

            <h1 className="display text-[2.2rem] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="line-mask block">
                <span
                  className="hero-line block"
                  style={{ animationDelay: SEQUENCE.line1 }}
                >
                  Construimos sitios y apps
                </span>
              </span>
              <span className="line-mask block">
                <span
                  className="hero-line block"
                  style={{ animationDelay: SEQUENCE.line2 }}
                >
                  para marcas que <span className="text-accent">crecen.</span>
                </span>
              </span>
            </h1>

            <div className="mt-10 flex flex-col gap-8">
              <p
                className="hero-rise max-w-md text-lg leading-relaxed text-muted md:text-xl"
                style={{ animationDelay: SEQUENCE.sub }}
              >
                Diseñamos y construimos tu web o app de punta a punta, lista y
                funcionando en 2 a 3 semanas.
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
                  <ButtonLink href="/pricing" variant="secondary">
                    Ver Precios & Alcance
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </ButtonLink>
                </Magnetic>
              </div>
            </div>
          </div>

          <div
            className="hero-rise lg:col-span-5"
            style={{ animationDelay: SEQUENCE.console }}
          >
            <BuildConsole />
          </div>
        </div>
      </Container>

      {/* Marquee de Clientes y Productos */}
      <div
        className="hero-rise relative mt-20 border-y border-border py-4 bg-surface/30"
        style={{ animationDelay: SEQUENCE.ticker }}
        onMouseMove={reduceMotion ? undefined : handleMarqueeMouseMove}
        onMouseLeave={reduceMotion ? undefined : () => setHovered(null)}
      >
        <Marquee duration={35}>
          {clientBrands.map((project) => (
            <span
              key={project.slug}
              onMouseEnter={
                reduceMotion ? undefined : () => setHovered(project)
              }
              className="flex items-center gap-8 pr-8 text-lg font-medium tracking-tight text-muted transition-colors hover:text-foreground md:text-xl"
            >
              <span>{project.name}</span>
              <span className="font-mono text-xs text-accent">
                [{project.category.split("/")[0].trim()}]
              </span>
              <span aria-hidden className="text-accent/40 text-xs">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Preview flotante: se abre en círculo desde el cursor al pasar sobre
          una marca de la marquesina, con un clip de ese proyecto adentro. */}
      {!reduceMotion && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              aria-hidden
              style={{ left: springX, top: springY }}
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
              initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
              animate={{ clipPath: "circle(75% at 50% 50%)", opacity: 1 }}
              exit={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="relative h-40 w-64 overflow-hidden rounded-2xl border border-border shadow-2xl">
                {hovered.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  >
                    <source src={hovered.video.webm} type="video/webm" />
                    <source src={hovered.video.mp4} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={hovered.image}
                    alt={hovered.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
