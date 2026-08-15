"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Marquee } from "@/components/ui/marquee";
import { capabilities } from "@/data/services";

// ponytail: 21st.dev's "cinematic-landing-hero" component sits behind a Pro/access-gated
// endpoint on their end (hasUserComponentAccess kept 503ing) — copying its source wasn't
// possible. This is a bespoke GSAP reveal + scroll parallax built in its spirit instead.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const lineRefs = [line1Ref.current, line2Ref.current, line3Ref.current];
      const revealTargets = [
        ".hero-kicker",
        ...lineRefs,
        ".hero-sub",
        ".hero-cta",
        ".hero-ticker",
      ];

      if (reduceMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, clipPath: "none" });
        return;
      }

      gsap.set(lineRefs, { clipPath: "inset(0 0 100% 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(".hero-kicker", { opacity: 1, y: 0, duration: 0.6 })
        .to(
          line1Ref.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.9 },
          "-=0.2",
        )
        .to(
          line2Ref.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.9 },
          "-=0.7",
        )
        .to(
          line3Ref.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.9 },
          "-=0.7",
        )
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(".hero-ticker", { opacity: 1, duration: 0.6 }, "-=0.3");

      gsap.to(gridRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-16"
    >
      <div
        ref={gridRef}
        aria-hidden
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
        <p className="hero-kicker mb-8 flex -translate-y-4 items-center gap-2.5 font-mono text-xs tracking-widest text-muted uppercase opacity-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Disponibles para nuevos proyectos
        </p>

        <h1 className="display max-w-3xl text-[2.6rem] text-foreground sm:max-w-4xl sm:text-6xl md:max-w-6xl md:text-[6.5rem]">
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block">
              Construimos
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block">
              experiencias digitales
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line3Ref} className="block">
              para marcas que{" "}
              <span className="text-accent">avanzan.</span>
            </span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-sub max-w-md -translate-y-4 text-lg leading-relaxed text-muted opacity-0 md:text-xl">
            Estrategia, diseño y tecnología — desde la primera idea hasta el
            producto final.
          </p>

          <div className="hero-cta flex -translate-y-4 flex-wrap items-center gap-3 opacity-0">
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

      <div className="hero-ticker relative mt-16 border-y border-border py-5 opacity-0">
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
