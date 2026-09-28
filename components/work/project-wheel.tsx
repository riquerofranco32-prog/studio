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
 * Cómo se apoyan las pantallas, para que no queden flotando:
 * - "piso": paradas sobre un piso con horizonte y su reflejo.
 * - "notebook": cada proyecto es una notebook; la tapa se abre al llegar al
 *   centro y las de los costados quedan entrecerradas.
 * Se puede forzar con ?rueda=piso o ?rueda=notebook para comparar.
 */
type Stage = "piso" | "notebook";
const DEFAULT_STAGE: Stage = "piso";
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
  const [stage, setStage] = useState<Stage>(DEFAULT_STAGE);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => setDims(measure());
    const init = () => {
      update();
      const q = new URLSearchParams(window.location.search).get("rueda");
      if (q === "piso" || q === "notebook") setStage(q);
    };
    init();
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

        {/* Piso: línea de horizonte y un plano apenas más claro debajo. */}
        {stage === "piso" && (
          <>
            <div
              aria-hidden
              style={{ top: `calc(50% - ${dims.lift}px + ${dims.h / 2}px)` }}
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.045),transparent_55%)]"
            />
            <div
              aria-hidden
              style={{ top: `calc(50% - ${dims.lift}px + ${dims.h / 2}px)` }}
              className="pointer-events-none absolute inset-x-[4%] h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.22),transparent)]"
            />
          </>
        )}

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
              accent={accentOf(project)}
              stage={stage}
              onSelect={() => scrollToIndex(i)}
            />
          ))}
        </motion.div>

        {/* Datos del proyecto activo, debajo de la tarjeta, con la
            personalidad de su marca: tipografía, color, frase y entrada. */}
        <div
          style={{
            top: `calc(50% - ${dims.lift}px + ${dims.h / 2 + (stage === "piso" ? dims.h * 0.26 : dims.w * 0.035 + 30)}px)`,
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
  stage,
  onSelect,
}: {
  project: Project;
  index: number;
  pos: MotionValue<number>;
  dims: Dims;
  active: boolean;
  accent: string;
  stage: Stage;
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
  // Tapa de la notebook: abierta en el centro, entrecerrada a los costados.
  const lid = useTransform(d, (v) => (stage === "notebook" ? Math.min(Math.abs(v), 1) * 40 : 0));
  const notebook = stage === "notebook";

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
      style={
        active && !notebook
          ? {
              borderColor: alpha(accent, 0.45),
              boxShadow: `0 40px 90px -40px ${alpha(accent, 0.55)}`,
            }
          : undefined
      }
      className={`focus-ring group relative block h-full w-full overflow-hidden bg-surface transition-[border-color,box-shadow] duration-700 ${notebook ? "rounded-[3px]" : "rounded-md border border-border"}`}
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
      {notebook ? (
        <>
          {/* Tapa: marco negro con la pantalla adentro; gira sobre la bisagra. */}
          <motion.div
            style={{
              rotateX: lid,
              transformOrigin: "50% 100%",
              padding: `${w * 0.02}px ${w * 0.02}px ${w * 0.014}px`,
              boxShadow: active ? `0 30px 80px -30px ${alpha(accent, 0.5)}` : undefined,
            }}
            className="relative h-full w-full rounded-t-[14px] border border-[#2c2c31] bg-[#0c0c0e] transition-shadow duration-700"
          >
            {card}
          </motion.div>
          {/* Base con el hueco para abrir la tapa. */}
          <div
            aria-hidden
            style={{ height: Math.max(6, w * 0.034) }}
            className="absolute top-full left-[-7%] w-[114%] rounded-b-[12px] bg-[linear-gradient(to_bottom,#3b3b41,#16161a)] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.85)]"
          >
            <div className="mx-auto h-[42%] w-[15%] rounded-b-md bg-[#0c0c0e]" />
          </div>
        </>
      ) : (
        <>
          {card}
          {/* Reflejo sobre el piso: la misma captura invertida y desvanecida. */}
          <div
            aria-hidden
            style={{
              transform: "scaleY(-1)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 45%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 45%)",
            }}
            className="pointer-events-none absolute top-full left-0 mt-[2px] h-full w-full overflow-hidden rounded-md"
          >
            <Image src={project.image} alt="" fill sizes="(min-width: 768px) 680px, 62vw" className="object-cover object-top" />
          </div>
        </>
      )}
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
