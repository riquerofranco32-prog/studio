"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MagneticLink } from "@/components/ui/magnetic-link";

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
        ".hero-scroll",
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
        .to(".hero-scroll", { opacity: 1, duration: 0.5 }, "-=0.3");

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
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20"
    >
      <div
        ref={gridRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-foreground/[0.03] blur-3xl"
      />

      <Container className="relative">
        <p className="hero-kicker mb-6 -translate-y-4 font-mono text-xs tracking-widest text-muted uppercase opacity-0">
          Estudio de producto digital y tecnología creativa
        </p>

        <h1 className="max-w-3xl text-[2.75rem] leading-[1.05] font-medium tracking-tight text-foreground sm:max-w-4xl sm:text-6xl md:max-w-5xl md:text-7xl">
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
              para marcas que avanzan.
            </span>
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-md -translate-y-4 text-lg text-muted opacity-0">
          Estrategia, diseño y tecnología — desde la primera idea hasta el
          producto final.
        </p>

        <div className="hero-cta mt-10 flex -translate-y-4 flex-wrap items-center gap-x-8 gap-y-4 opacity-0">
          <MagneticLink
            href="#work"
            className="text-sm font-medium text-foreground"
          >
            Ver nuestro trabajo <ArrowRight size={15} />
          </MagneticLink>
          <MagneticLink
            href="#contact"
            className="text-sm text-muted hover:text-foreground"
          >
            Iniciar un proyecto <ArrowRight size={15} />
          </MagneticLink>
        </div>
      </Container>

      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0">
        <div className="animate-bounce text-muted">
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
