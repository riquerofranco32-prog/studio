"use client";

import { useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TeamMember } from "@/types";

/**
 * Roster en filas, en el mismo lenguaje que la lista de Servicios: la fila es el
 * elemento, no la tarjeta. Si el miembro tiene foto, aparece siguiendo al cursor;
 * si no, la fila se resuelve sola con el estado en acento — que es el caso hoy,
 * porque `imageUrl` está vacío en data/team.ts.
 */
export function TeamRoster({ members }: { members: TeamMember[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 26, mass: 0.4 };
  const followerX = useSpring(x, springConfig);
  const followerY = useSpring(y, springConfig);

  const active = members.find((m) => m.id === hovered && m.imageUrl);

  function pointerPosition(event: MouseEvent<HTMLElement>) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { px: event.clientX - rect.left, py: event.clientY - rect.top };
  }

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const p = pointerPosition(event);
    if (!p) return;
    x.set(p.px);
    y.set(p.py);
  }

  // Al entrar hay que fijar la posición sin animar: si el retrato monta con los
  // springs en 0, aparece un instante en la esquina y recién después viaja hasta
  // el cursor. `jump` lo coloca ya donde está el mouse.
  function handleEnter(event: MouseEvent<HTMLElement>, id: string) {
    const p = pointerPosition(event);
    if (p) {
      x.jump(p.px);
      y.jump(p.py);
      followerX.jump(p.px);
      followerY.jump(p.py);
    }
    setHovered(id);
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setHovered(null)}
      className="relative border-t border-border"
    >
      {members.map((member, i) => {
        const number = String(i + 1).padStart(2, "0");
        const isActive = hovered === member.id;

        const content = (
          <>
            {/* Filete de acento que crece al entrar en la fila. */}
            <span
              aria-hidden
              className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ${
                isActive ? "w-full" : "w-0"
              }`}
            />

            <span
              className={`font-mono text-sm transition-colors duration-300 md:col-span-1 ${
                isActive ? "text-accent" : "text-muted"
              }`}
            >
              {number}
            </span>

            <span
              className={`display text-3xl transition-transform duration-500 md:col-span-6 md:text-5xl ${
                isActive ? "md:translate-x-2" : ""
              }`}
            >
              {member.name ?? "Nombre a definir"}
            </span>

            <span className="text-base text-muted md:col-span-4 md:text-lg">
              {member.role}
            </span>

            <span className="flex items-center gap-2 text-sm text-muted md:col-span-1 md:justify-end">
              {member.linkedin && (
                <>
                  <span className="md:sr-only">LinkedIn</span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className={`transition-all duration-300 ${
                      isActive
                        ? "translate-x-0 text-accent opacity-100"
                        : "md:-translate-y-1 md:opacity-0"
                    }`}
                  />
                </>
              )}
            </span>
          </>
        );

        const rowClass =
          "group relative grid grid-cols-1 items-baseline gap-x-6 gap-y-2 border-b border-border py-8 text-foreground transition-colors duration-500 md:grid-cols-12 md:py-10";

        return member.linkedin ? (
          <a
            key={member.id}
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => handleEnter(e, member.id)}
            onFocus={() => setHovered(member.id)}
            onBlur={() => setHovered(null)}
            aria-label={`${member.name ?? "Miembro del equipo"} — ${member.role}. Ver perfil de LinkedIn`}
            className={`focus-ring ${rowClass}`}
          >
            {content}
          </a>
        ) : (
          <div
            key={member.id}
            onMouseEnter={(e) => handleEnter(e, member.id)}
            className={rowClass}
          >
            {content}
          </div>
        );
      })}

      {/* Retrato flotante. Sólo con foto cargada y sin prefers-reduced-motion:
          un elemento que persigue el cursor es exactamente lo que esa preferencia
          pide evitar. */}
      <AnimatePresence>
        {active && !reduceMotion && (
          // Tres capas a propósito: si el seguimiento del cursor (x/y) y la
          // animación de entrada (scale) viven en el mismo elemento, framer-motion
          // resuelve el transform con su propio estado y pisa las MotionValues —
          // el retrato queda clavado en el origen.
          <motion.div
            aria-hidden
            style={{ x: followerX, y: followerY }}
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-full border border-border"
              >
                <Image
                  src={active.imageUrl as string}
                  alt=""
                  width={260}
                  height={260}
                  sizes="260px"
                  className="h-[260px] w-[260px] object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
