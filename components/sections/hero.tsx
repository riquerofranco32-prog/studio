"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Marquee } from "@/components/ui/marquee";
import { Magnetic } from "@/components/ui/magnetic";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { projects } from "@/data/projects";
import { LiveClock } from "@/components/ui/live-clock";

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

  const clientBrands = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section
      ref={rootRef}
      className="relative flex flex-col overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16"
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
            <span className="text-muted">· 6+ Productos en Producción</span>
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
              software & craft
            </span>
          </span>
          <span className="line-mask block">
            <span
              className="hero-line block"
              style={{ animationDelay: SEQUENCE.line3 }}
            >
              para marcas que{" "}
              <span className="text-accent drop-shadow-[0_0_25px_rgba(255,77,46,0.35)]">
                escalan.
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            className="hero-rise max-w-md text-lg leading-relaxed text-muted md:text-xl"
            style={{ animationDelay: SEQUENCE.sub }}
          >
            Estrategia de producto, diseño de sistemas y arquitectura de ingeniería en Next.js 16 — de 0 a producción en 2 a 3 semanas.
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
      </Container>

      {/* Marquee de Clientes y Productos */}
      <div
        className="hero-rise relative mt-20 border-y border-border py-4 bg-surface/30"
        style={{ animationDelay: SEQUENCE.ticker }}
      >
        <Marquee duration={35}>
          {clientBrands.map((project) => (
            <span
              key={project.slug}
              className="flex items-center gap-8 pr-8 text-lg font-medium tracking-tight text-muted transition-colors hover:text-foreground md:text-xl"
            >
              <span>{project.name}</span>
              <span className="font-mono text-xs text-accent">[{project.category.split("/")[0].trim()}]</span>
              <span aria-hidden className="text-accent/40 text-xs">
                ✱
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
