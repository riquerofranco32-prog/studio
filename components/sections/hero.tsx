"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
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
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";
import { SpinningCircularText } from "@/components/ui/spinning-circular-text";

// WebGL puro: no hay nada que renderizar en el servidor, y mezclar SSR con un
// hook que resuelve distinto en servidor/cliente (useReducedMotion) rompía la
// hidratación. ssr:false lo saca del árbol server-rendered por completo.
const PhosphorShader = dynamic(
  () => import("@/components/ui/phosphor-shader").then((m) => m.PhosphorShader),
  { ssr: false },
);

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
  widget: "1.2s",
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
      {/* Shader de fondo: capa de textura por debajo del grid, apagado y en
          escala de grises para no competir con el acento naranja de la marca. */}
      <div className="pointer-events-none absolute inset-0 opacity-25 grayscale">
        <PhosphorShader className="h-full w-full" />
      </div>
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

      {/* Badge circular: mismo espíritu que el "15 YEARS" de DHNN — un sello
          de estudio, no decoración porque sí. Sólo desktop, igual que el widget. */}
      <div
        className="hero-rise absolute bottom-24 left-8 z-10 hidden lg:block"
        style={{ animationDelay: SEQUENCE.widget }}
      >
        <div className="relative grid place-items-center">
          <SpinningCircularText
            text={`SE7EN STUDIO • ${SITE.stats.years} • `}
            fontSize="0.95rem"
            className="text-muted"
          />
          <span
            aria-hidden
            className="absolute h-2.5 w-2.5 rounded-full bg-accent"
          />
        </div>
      </div>

      {/* Widget de stats: sólo en desktop, hay lugar de sobra a la derecha del
          titular. En mobile el hero ya está apretado, no vale la pena sumar peso. */}
      <div
        className="hero-rise absolute right-8 top-28 z-10 hidden w-52 rounded-xl border border-border bg-background/70 p-5 backdrop-blur-md lg:block"
        style={{ animationDelay: SEQUENCE.widget }}
      >
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Proyectos
            </dt>
            <dd className="display mt-1 text-3xl text-foreground">
              {projects.length}
            </dd>
          </div>
          <div className="border-t border-border pt-4">
            <dt className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Estudio
            </dt>
            <dd className="mt-1 text-sm text-muted">
              {SITE.stats.people} personas · {SITE.stats.years}
            </dd>
          </div>
        </dl>
      </div>

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
