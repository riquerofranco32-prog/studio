"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/work/project-card";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Project } from "@/types";

// Galería horizontal de proyectos. El scroll es nativo (scroll-snap), así que
// en mobile se desliza con el dedo y en desktop con trackpad, flechas del
// teclado o arrastrando con el mouse. Las flechas avanzan de a una tarjeta.
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const { scrollXProgress } = useScroll({ container: trackRef });
  const progress = useSpring(scrollXProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  // Al filtrar, volver al principio: si no, la fila puede quedar scrolleada
  // más allá de donde terminan las tarjetas nuevas.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [projects]);

  function cards() {
    return Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? [],
    );
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const left = track.scrollLeft;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({ start: left <= 4, end: left >= max - 4 });
    // Tarjeta activa = la que tiene el borde izquierdo más cerca del del track.
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let best = Infinity;
    cards().forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - trackLeft);
      if (d < best) {
        best = d;
        closest = i;
      }
    });
    setActive(left >= max - 4 ? projects.length - 1 : closest);
  }

  function go(dir: 1 | -1) {
    const target = cards()[Math.min(Math.max(active + dir, 0), projects.length - 1)];
    const track = trackRef.current;
    if (!target || !track) return;
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  // Arrastre con mouse. Touch y trackpad ya los resuelve el scroll nativo.
  // Mientras se arrastra se apaga el snap (si no, pelea con el cursor) y, si
  // el mouse se movió, se cancela el click para no abrir el proyecto sin querer.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: track.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const track = trackRef.current;
    if (!d.down || !track) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      track.style.scrollSnapType = "none";
      track.style.cursor = "grabbing";
    }
    if (d.moved) track.scrollLeft = d.startLeft - dx;
  }

  function endDrag() {
    const d = drag.current;
    const track = trackRef.current;
    if (!d.down || !track) return;
    d.down = false;
    if (!d.moved) return;
    track.style.cursor = "";
    // Reactivar el snap después del frame actual para que la tarjeta más
    // cercana se acomode sola en vez de saltar.
    requestAnimationFrame(() => {
      track.style.scrollSnapType = "";
    });
  }

  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos"
        className="focus-ring no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-2 md:-mx-10 md:cursor-grab md:scroll-px-10 md:gap-8 md:px-10"
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-slide
            className="w-[75vw] shrink-0 snap-start sm:w-[60vw] md:w-[44vw] lg:w-[36vw] 2xl:w-[520px]"
          >
            <ProjectCard
              project={project}
              priority={i === 0}
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 44vw, 75vw"
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <span
          aria-live="polite"
          className="shrink-0 font-mono text-xs tabular-nums text-muted"
        >
          <span className="text-foreground">
            {String(active + 1).padStart(2, "0")}
          </span>{" "}
          / {String(projects.length).padStart(2, "0")}
        </span>

        <div className="relative h-px flex-1 bg-border">
          <motion.div
            style={{ scaleX: reduceMotion ? scrollXProgress : progress }}
            className="absolute inset-0 origin-left bg-accent"
          />
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={edges.start}
            aria-label="Proyecto anterior"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40 disabled:opacity-30 disabled:hover:border-border"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={edges.end}
            aria-label="Proyecto siguiente"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40 disabled:opacity-30 disabled:hover:border-border"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
