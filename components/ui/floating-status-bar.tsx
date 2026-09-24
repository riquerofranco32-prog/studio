"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { SLOTS } from "@/lib/availability";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const ROTATING_MESSAGES = [
  `${SLOTS} ${SLOTS === 1 ? "cupo abierto" : "cupos abiertos"}`,
  "Arrancamos en 7 días",
  "Respuesta < 24 h",
  "Sin intermediarios",
];

// Por debajo de lg la píldora centrada choca con el botón de WhatsApp (a 768
// se pisan ~20px), y en mobile ya hay WhatsApp y CTA en el menú.
const LG = "(min-width: 1024px)";

/**
 * true mientras el <footer> esté en pantalla. Los flotantes de abajo se
 * esconden ahí: el footer ya trae su propio CTA, WhatsApp y el copyright en la
 * misma franja que ellos ocupan.
 */
export function useFooterInView() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return inView;
}

export function FloatingStatusBar() {
  const isLarge = useMediaQuery(LG);
  const reduceMotion = useReducedMotion();
  const footerInView = useFooterInView();
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 300);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = isLarge && scrolled && !footerInView && !dismissed;

  // Rotar mensajes cada 3 segundos cuando la barra es visible
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [visible, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/80 bg-surface/90 p-1.5 pl-4 shadow-2xl backdrop-blur-md"
        >
          {/* Status Dot + mensaje rotativo. Sin aria-live: anunciar un
              mensaje de marketing cada 3s a un lector de pantalla es ruido. */}
          <div className="flex items-center gap-2 pr-2 border-r border-border">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <div className="relative w-32 overflow-hidden h-4 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={msgIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute font-mono text-xs text-foreground font-medium whitespace-nowrap"
                >
                  {ROTATING_MESSAGES[msgIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Agendar call. WhatsApp y ⌘K no van acá: ya están en el widget
              de al lado y en el navbar. */}
          <button
            type="button"
            id="floating-bar-booking"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-booking-modal"))
            }
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-background transition-colors"
          >
            <Calendar size={13} />
            <span>Agendar 15 min</span>
          </button>

          {/* Dismiss */}
          <button
            type="button"
            id="floating-bar-dismiss"
            onClick={() => setDismissed(true)}
            className="focus-ring rounded-full p-1 text-muted hover:text-foreground transition-colors"
            aria-label="Cerrar barra"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
