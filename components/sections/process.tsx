"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { process } from "@/data/services";
import { DUR, EASE } from "@/lib/motion";
import { MD, useMediaQuery } from "@/lib/use-media-query";

/**
 * Alto del contenedor que sostiene el pin. El bloque pineado mide 100vh, así
 * que el recorrido pineado real es 400 - 100 = 300vh, o sea 75vh por paso.
 * Se eligió 400vh y no 500vh (que daría los 100vh por paso exactos) porque
 * cuatro pantallas completas de scroll para leer cuatro frases se hace largo.
 */
const PIN_VH = 400;

export function Process() {
  const [active, setActive] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);

  // Debajo de md no hay pin: la sección vuelve a ser una lista con scroll
  // horizontal y los pasos se eligen a mano. Pinear en un teléfono secuestra
  // cuatro pantallas de scroll, que es justo lo que la gente odia de esto.
  const pinned = useMediaQuery(MD);

  // El pin es CSS sticky: nativo, compositado, sin JS. useScroll sólo lee el
  // progreso para saber qué paso mostrar — no mueve nada. Por eso no hizo falta
  // ScrollTrigger, que costaba 42.5 KB gzip para llegar a lo mismo.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!pinned) return;
    // clamp: en el último píxel p llega a 1 y floor daría un índice de más.
    const next = Math.min(Math.floor(p * process.length), process.length - 1);
    setActive((cur) => (cur === next ? cur : next));
  });

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading kicker="Proceso" title="Cómo construimos." />
      </Container>

      {/* El alto extra sólo existe desde md. `sticky` sin alto de sobra en el
          padre no pinea nada, así que en mobile el bloque simplemente fluye. */}
      <div
        ref={pinRef}
        data-pin="process"
        className="relative mt-16 md:mt-0 md:[height:var(--pin-height)]"
        style={{ ["--pin-height" as string]: `${PIN_VH}vh` }}
      >
        <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
          <Container className="w-full">
            <div className="flex flex-col gap-0 md:flex-row md:gap-8">
              <div
                className={
                  pinned
                    ? "flex flex-col"
                    : "flex flex-row overflow-x-auto md:flex-col md:overflow-visible"
                }
              >
                {process.map((step, i) => (
                  <button
                    key={step.number}
                    // Con el pin activo el scroll es la fuente de verdad, así
                    // que el click navega hasta el tramo del paso en vez de
                    // pelearse con él. Sin pin, selecciona directo.
                    onClick={() => {
                      if (!pinned) return setActive(i);
                      const el = pinRef.current;
                      if (!el) return;
                      window.scrollTo({
                        top:
                          el.offsetTop +
                          (el.offsetHeight * i) / process.length,
                        behavior: "smooth",
                      });
                    }}
                    onMouseEnter={pinned ? undefined : () => setActive(i)}
                    onFocus={pinned ? undefined : () => setActive(i)}
                    aria-current={active === i ? "step" : undefined}
                    className="focus-ring relative flex shrink-0 items-center gap-4 border-b border-border py-6 pr-10 text-left transition-colors md:w-72 md:border-b-0 md:border-l-2 md:border-l-border md:pl-6"
                  >
                    {/* Filete de acento: crece de arriba hacia abajo con el paso
                        activo. scaleY sobre un elemento propio en vez de animar
                        el border — se compone en GPU y no toca layout. */}
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ scaleY: active === i ? 1 : 0 }}
                      transition={{ duration: DUR.fast, ease: EASE }}
                      className="absolute -left-0.5 top-0 hidden h-full w-0.5 origin-top bg-accent md:block"
                    />
                    <span
                      className={`font-mono text-sm transition-colors ${
                        active === i ? "text-accent" : "text-muted"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span
                      className={`text-lg font-medium tracking-tight transition-colors ${
                        active === i ? "text-foreground" : "text-muted"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative mt-10 min-h-[160px] flex-1 md:mt-0">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.fast, ease: EASE }}
                >
                  <p className="font-mono text-xs tracking-widest text-accent uppercase">
                    Paso {process[active].number}
                  </p>
                  <h3 className="display mt-4 text-3xl text-foreground md:text-5xl">
                    {process[active].title}
                  </h3>
                  <p className="mt-4 max-w-md text-lg text-muted">
                    {process[active].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
