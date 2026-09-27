"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/work/project-card";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/motion";
import type { Project } from "@/types";

// Rueda horizontal de proyectos. La sección es alta y su interior queda fijo
// (sticky) mientras se scrollea: el scroll recorre la lista, el proyecto
// activo se ve grande en el centro y el resto queda en miniatura a los
// costados, girado como sobre un cilindro. Al scrollear rápido se desenfoca
// un poco, como un barrido.

/** Escala de las miniaturas respecto de la tarjeta activa. */
const SMALL = 0.3;
/** Aire entre la activa y la primera miniatura, en px. */
const GAP = 32;
/** Aire entre miniaturas, en px (ya escaladas). */
const THUMB_GAP = 14;
/** Cuánto sube la tarjeta respecto del centro, para dejar lugar a los datos. */
const LIFT = 40;
/** Alto de scroll que consume cada proyecto, en vh. */
const STEP_VH = 60;

type Dims = { w: number; h: number; mobile: boolean };

function measure(): Dims {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // La tarjeta tiene que dejar lugar a las miniaturas de los costados y, en
  // alto, a los datos del proyecto que van debajo.
  const byWidth = vw < 768 ? vw * 0.62 : Math.min(vw * 0.46, 680);
  const byHeight = (vh * 0.5 * 16) / 10;
  const w = Math.min(byWidth, byHeight);
  return { w, h: (w * 10) / 16, mobile: vw < 768 };
}

export function ProjectWheel({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();

  // Sin la rueda para quien pidió menos movimiento: la grilla de siempre.
  if (reduceMotion) {
    return (
      <div className="mx-auto mt-12 grid w-full max-w-[1400px] grid-cols-1 gap-x-8 gap-y-14 px-6 md:grid-cols-2 md:px-10">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            priority={i === 0}
            index={i % 2}
          />
        ))}
      </div>
    );
  }

  return <Wheel projects={projects} />;
}

function Wheel({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const n = projects.length;
  const [dims, setDims] = useState<Dims>({ w: 620, h: 387.5, mobile: false });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => setDims(measure());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, (p) => p * (n - 1));
  // Resorte corto: suaviza el paso entre proyectos sin sentirse atrasado.
  const pos = useSpring(raw, { stiffness: 180, damping: 30, mass: 0.6 });

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.round(v)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // Desenfoque por velocidad: quieto es 0, barriendo llega a 6px.
  const velocity = useVelocity(pos);
  const blur = useTransform(velocity, (v) => {
    const px = Math.min(Math.abs(v) * 1.6, 6);
    return px < 0.3 ? "none" : `blur(${px.toFixed(1)}px)`;
  });

  function scrollToIndex(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * i) / (n - 1), behavior: "smooth" });
  }

  const current = projects[active];

  return (
    <div
      ref={sectionRef}
      style={{ height: `calc(100vh + ${(n - 1) * STEP_VH}vh)` }}
      className="relative mt-8"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        {/* Pila de proyectos */}
        <motion.div
          style={{ filter: blur, perspective: 1200 }}
          className="relative h-full w-full"
        >
          {projects.map((project, i) => (
            <WheelItem
              key={project.slug}
              project={project}
              index={i}
              pos={pos}
              dims={dims}
              active={i === active}
              onSelect={() => scrollToIndex(i)}
            />
          ))}
        </motion.div>

        {/* Datos del proyecto activo, debajo de la tarjeta: nombre a la
            izquierda; año, categoría y link a la derecha. */}
        <div
          style={{
            top: `calc(50% + ${dims.h / 2 + LIFT + 24}px)`,
            width: dims.mobile ? "calc(100% - 48px)" : Math.max(dims.w, 560),
          }}
          className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-start justify-between gap-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`l-${current.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="min-w-0"
            >
              <span className="font-mono text-xs text-accent">
                {current.number}
              </span>
              <p className="mt-1 text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {current.name}
              </p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`r-${current.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="shrink-0 text-right font-mono text-[11px] uppercase tracking-wide text-muted"
            >
              <p>
                <span className="text-foreground">{current.year}</span> ·{" "}
                {current.category.split("/")[0].trim()}
              </p>
              <Link
                href={`/work/${current.slug}`}
                className="focus-ring pointer-events-auto mt-2 inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                Ver caso
                <ArrowUpRight size={13} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contador */}
        <div className="pointer-events-none absolute bottom-8 left-6 font-mono text-xs tabular-nums text-muted md:left-10">
          <span className="text-foreground">
            {String(active + 1).padStart(2, "0")}
          </span>{" "}
          / {String(n).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

function WheelItem({
  project,
  index,
  pos,
  dims,
  active,
  onSelect,
}: {
  project: Project;
  index: number;
  pos: MotionValue<number>;
  dims: Dims;
  active: boolean;
  onSelect: () => void;
}) {
  const { w, mobile } = dims;
  // En mobile entra una sola miniatura por lado.
  const fadeFrom = mobile ? 1 : 2.2;
  // Distancia centro a centro entre la activa y la primera miniatura.
  const near = w / 2 + (SMALL * w) / 2 + (mobile ? 14 : GAP);
  // Paso entre miniaturas sucesivas.
  const far = SMALL * w + THUMB_GAP;

  const d = useTransform(pos, (p) => index - p);
  const x = useTransform(d, (v) => {
    const a = Math.abs(v);
    const off = a <= 1 ? a * near : near + (a - 1) * far;
    return Math.sign(v) * off;
  });
  const scale = useTransform(d, (v) => {
    const a = Math.min(Math.abs(v), 1);
    return 1 - (1 - SMALL) * a;
  });
  const rotateY = useTransform(d, (v) => Math.max(-28, Math.min(28, v * 16)));
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    return a <= fadeFrom ? 1 : Math.max(0, 1 - (a - fadeFrom) * (mobile ? 1.5 : 0.5));
  });
  const zIndex = useTransform(d, (v) => 100 - Math.round(Math.abs(v) * 10));

  return (
    <motion.div
      style={{
        x,
        scale,
        rotateY,
        opacity,
        zIndex,
        width: dims.w,
        height: dims.h,
        marginLeft: -dims.w / 2,
        marginTop: -dims.h / 2 - LIFT,
      }}
      className="absolute left-1/2 top-1/2 will-change-transform"
    >
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.name} — ${project.category}`}
        tabIndex={active ? 0 : -1}
        onClick={(e) => {
          if (!active) {
            e.preventDefault();
            onSelect();
          }
        }}
        className="focus-ring group relative block h-full w-full overflow-hidden rounded-md border border-border bg-surface"
      >
        <Image
          src={project.image}
          alt=""
          fill
          priority={index === 0}
          sizes="(min-width: 768px) 680px, 62vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>
    </motion.div>
  );
}
