"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionValue,
  TargetAndTransition,
  Transition,
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
import { brandFonts } from "@/lib/brand-fonts";
import type { Project, ProjectBrand } from "@/types";

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
/**
 * Cada proyecto es una notebook vista apenas desde arriba: cerrada a los
 * costados (se ve la tapa de aluminio) y abierta en el centro. La tapa gira
 * sobre la bisagra con el scroll, así que se abre mientras llega.
 */
/** Ángulo de la tapa abierta (positivo: apenas reclinada hacia atrás). */
const LID_OPEN = 12;
/** Ángulo de la tapa cerrada, apoyada sobre el teclado. */
const LID_CLOSED = -89;
/** Cuánto del teclado se ve debajo de la bisagra, en fracción del alto. */
const DECK_VISIBLE = 0.2;
/** Alto de scroll que consume cada proyecto, en vh. */
const STEP_VH = 60;

type Dims = { w: number; h: number; mobile: boolean; lift: number };

function measure(): Dims {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // La tarjeta tiene que dejar lugar a las miniaturas de los costados y, en
  // alto, a los datos del proyecto que van debajo.
  const byWidth = vw < 768 ? vw * 0.62 : Math.min(vw * 0.46, 680);
  const byHeight = (vh * 0.44 * 16) / 10;
  const w = Math.min(byWidth, byHeight);
  const mobile = vw < 768;
  // Cuánto sube la tarjeta respecto del centro: deja lugar abajo al piso (o
  // la base de la notebook) y a los datos del proyecto.
  return { w, h: (w * 10) / 16, mobile, lift: mobile ? 50 : Math.round(vh * 0.08) };
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
  const [dims, setDims] = useState<Dims>({ w: 620, h: 387.5, mobile: false, lift: 70 });
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
        {/* Luz ambiente del color de la marca activa, detrás de la pila. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`glow-${current.slug}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              background: `radial-gradient(ellipse 60% 48% at 50% calc(50% - ${dims.lift}px), ${alpha(accentOf(current), 0.2)}, transparent 72%)`,
            }}
            className="pointer-events-none absolute inset-0"
          />
        </AnimatePresence>

        {/* Pila de proyectos */}
        <motion.div
          // Cámara un poco por encima: deja ver el teclado y la tapa cerrada.
          style={{ filter: blur, perspective: 2600, perspectiveOrigin: "50% 18%" }}
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
              accent={accentOf(project)}
              onSelect={() => scrollToIndex(i)}
            />
          ))}
        </motion.div>

        {/* Datos del proyecto activo, debajo de la tarjeta, con la
            personalidad de su marca: tipografía, color, frase y entrada. */}
        <div
          style={{
            top: `calc(50% - ${dims.lift}px + ${dims.h / 2 + dims.h * DECK_VISIBLE + 18}px)`,
            width: dims.mobile ? "calc(100% - 48px)" : Math.max(dims.w, 760),
          }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <BrandLabel key={current.slug} project={current} mobile={dims.mobile} />
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
  accent,
  onSelect,
}: {
  project: Project;
  index: number;
  pos: MotionValue<number>;
  dims: Dims;
  active: boolean;
  accent: string;
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
  // Tapa: abierta en el centro, se va cerrando a medida que se aleja.
  const lid = useTransform(d, (v) => {
    const t = Math.min(Math.abs(v), 1);
    const e = t * t * (3 - 2 * t);
    return LID_OPEN + (LID_CLOSED - LID_OPEN) * e;
  });

  const card = (
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
      className="focus-ring group relative block h-full w-full overflow-hidden rounded-[2px] bg-black"
    >
      <Image
        src={project.image}
        alt=""
        fill
        priority={index === 0}
        sizes="(min-width: 768px) 680px, 62vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Sólo el activo monta su clip: el resto no baja ni un byte. */}
      {active && project.video && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-top"
        >
          <source src={project.video.webm} type="video/webm" />
          <source src={project.video.mp4} type="video/mp4" />
        </video>
      )}
    </Link>
  );

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
        marginTop: -dims.h / 2 - dims.lift,
        // Escala desde abajo: todas las pantallas quedan paradas sobre la
        // misma línea en vez de flotar a media altura.
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
      }}
      className="absolute left-1/2 top-1/2 will-change-transform"
    >
      {/* Base: teclado y trackpad, acostada hacia la cámara desde la bisagra. */}
      <div
        aria-hidden
        style={{ transform: "rotateX(90deg)", transformOrigin: "50% 0%" }}
        className="absolute top-full left-[-3%] h-full w-[106%] rounded-b-[18px] rounded-t-[4px] bg-[linear-gradient(to_bottom,#3c3d42,#2a2b2f_60%,#222327)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_40px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* Teclado: teclas oscuras separadas por el aluminio. */}
        <div className="absolute top-[9%] left-[9%] h-[50%] w-[82%] rounded-[4px] bg-[#131316] [background-image:repeating-linear-gradient(to_right,transparent_0,transparent_calc(100%/14_-_3px),#35363b_calc(100%/14_-_3px),#35363b_calc(100%/14)),repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(100%/6_-_3px),#35363b_calc(100%/6_-_3px),#35363b_calc(100%/6))]" />
        {/* Trackpad. */}
        <div className="absolute top-[64%] left-1/2 h-[28%] w-[36%] -translate-x-1/2 rounded-[6px] bg-[linear-gradient(to_bottom,#35363b,#2d2e33)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        {/* Hueco para abrir la tapa, en el borde de adelante. */}
        <div className="absolute bottom-0 left-1/2 h-[2.5%] w-[14%] -translate-x-1/2 rounded-t-md bg-[#18181b]" />
      </div>

      {/* Tapa: gira sobre la bisagra. Adelante la pantalla, atrás el aluminio. */}
      <motion.div
        style={{ rotateX: lid, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Frente: canto de aluminio, bisel negro con cámara y la pantalla. */}
        <div
          style={{
            backfaceVisibility: "hidden",
            padding: `${w * 0.028}px ${w * 0.018}px ${w * 0.03}px`,
            boxShadow: active ? `0 0 0 1px #4a4b51, 0 30px 90px -30px ${alpha(accent, 0.55)}` : "0 0 0 1px #4a4b51",
          }}
          className="absolute inset-0 rounded-t-[16px] rounded-b-[6px] bg-[#0a0a0b] transition-shadow duration-700"
        >
          <span
            aria-hidden
            style={{ top: w * 0.011, width: Math.max(3, w * 0.008), height: Math.max(3, w * 0.008) }}
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#1d2a3a] shadow-[0_0_0_1px_#26262b]"
          />
          {card}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3%] rounded-b-[6px] bg-[linear-gradient(to_bottom,#1a1a1d,#0e0e10)]" />
        </div>
        {/* Dorso: aluminio con el punto de luz del color de la marca. */}
        <div
          aria-hidden
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
          className="absolute inset-0 flex items-center justify-center rounded-t-[16px] rounded-b-[6px] bg-[linear-gradient(135deg,#4a4b51,#303136_45%,#26272b)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
        >
          <span
            style={{ background: accent, boxShadow: `0 0 ${w * 0.05}px ${alpha(accent, 0.6)}` }}
            className="block h-[9%] w-[5.6%] rounded-full opacity-80"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Hex #rrggbb + opacidad → #rrggbbaa. */
function alpha(hex: string, a: number) {
  return `${hex}${Math.round(a * 255).toString(16).padStart(2, "0")}`;
}

function accentOf(project: Project) {
  return project.brand?.accent ?? "#ff4d2e";
}

// Cada marca entra a su manera: Takefyy de golpe, Apex con un corte, Poné La
// Pava suave como una revista, Pravilo desde abajo, Muzzaga en diagonal como
// un saque, Sentinel barriendo como un escaneo y Altum abriendo el espaciado.
const ENTRANCES: Record<
  ProjectBrand["entrance"],
  { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition }
> = {
  slam: {
    initial: { opacity: 0, scale: 1.35, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { type: "spring", stiffness: 420, damping: 26 },
  },
  wipe: {
    initial: { clipPath: "inset(0 100% 0 0)" },
    animate: { clipPath: "inset(0 0% 0 0)" },
    transition: { duration: 0.55, ease: [0.77, 0, 0.18, 1] },
  },
  soft: {
    initial: { opacity: 0, y: 18, filter: "blur(12px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.95, ease: EASE },
  },
  rise: {
    initial: { opacity: 0, y: 46 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  slide: {
    initial: { opacity: 0, x: -70, skewX: -14 },
    animate: { opacity: 1, x: 0, skewX: 0 },
    transition: { type: "spring", stiffness: 340, damping: 22 },
  },
  scan: {
    initial: { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
    animate: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
  spread: {
    initial: { opacity: 0, letterSpacing: "0.4em" },
    animate: { opacity: 1, letterSpacing: "0em" },
    transition: { duration: 1.1, ease: EASE },
  },
};

const BrandLabel = ({
  project,
  mobile,
  ref,
}: {
  project: Project;
  mobile: boolean;
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const brand = project.brand;
  const accent = accentOf(project);
  const entrance = ENTRANCES[brand?.entrance ?? "soft"];
  const fontClass = brand ? brandFonts[brand.font] : "";
  const type: React.CSSProperties = {
    fontWeight: brand?.weight,
    fontStyle: brand?.italic ? "italic" : undefined,
    textTransform: brand?.uppercase ? "uppercase" : undefined,
    letterSpacing:
      brand?.entrance === "spread" ? undefined : brand?.tracking != null ? `${brand.tracking}em` : undefined,
  };
  const tagline = brand?.tagline;
  const hl = brand?.highlight && tagline?.includes(brand.highlight) ? brand.highlight : null;
  const [before, after] = hl && tagline ? tagline.split(hl) : [tagline, ""];

  return (
    <motion.div
      ref={ref}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      className="flex items-end justify-between gap-6"
    >
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          <span style={{ color: accent }}>{project.number}</span>
          <span className="mx-2 text-border">/</span>
          {project.category.split("/")[0].trim()} · {project.year}
        </p>
        <motion.div
          initial={entrance.initial}
          animate={entrance.animate}
          transition={entrance.transition}
          style={{ transformOrigin: "left bottom" }}
          className={fontClass}
        >
          <p
            style={type}
            className={`mt-2 leading-[0.95] text-foreground ${mobile ? "text-4xl" : "text-5xl lg:text-6xl"}`}
          >
            {project.name}
          </p>
          {tagline && (
            <p
              style={{ ...type, fontWeight: brand?.font === "outfit" ? 500 : type.fontWeight }}
              className={`mt-2 leading-tight text-muted ${mobile ? "text-base" : "text-lg lg:text-xl"}`}
            >
              {before}
              {hl && <span style={{ color: accent }}>{hl}</span>}
              {after}
            </p>
          )}
        </motion.div>
      </div>
      <Link
        href={`/work/${project.slug}`}
        // --brand: el hover rellena con el color de la marca.
        style={{ borderColor: alpha(accent, 0.5), color: accent, ["--brand" as string]: accent }}
        className="focus-ring pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors duration-300 hover:!bg-[var(--brand)] hover:!text-background"
      >
        Ver caso
        <ArrowUpRight size={13} />
      </Link>
    </motion.div>
  );
};
