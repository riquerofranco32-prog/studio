"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Command, MessageCircle, X } from "lucide-react";
import { SITE } from "@/data/site";

const ROTATING_MESSAGES = [
  "2 cupos abiertos",
  "Kickoff en 7 días",
  "Respuesta < 2 hs",
  "Sin intermediarios",
];

export function FloatingStatusBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!dismissed && window.scrollY > 300) {
        setVisible(true);
      } else if (window.scrollY <= 300) {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  // Rotar mensajes cada 3 segundos cuando la barra es visible
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [visible]);

  if (dismissed) return null;

  const whatsappUrl = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Hola Se7en Studio! Me gustaría consultarles sobre un proyecto.",
  )}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-surface/90 p-1.5 pl-4 shadow-2xl backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          {/* Status Dot + mensaje rotativo */}
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

          {/* Agendar call */}
          <button
            type="button"
            id="floating-bar-booking"
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-background transition-colors"
          >
            <Calendar size={13} />
            <span>Agendar 15 min</span>
          </button>

          {/* WhatsApp rápido */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-bar-whatsapp"
            className="focus-ring inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            title="Escribir por WhatsApp"
          >
            <MessageCircle size={11} />
          </a>

          {/* Cmd+K */}
          <button
            type="button"
            id="floating-bar-cmd"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="focus-ring inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted hover:border-foreground/30 hover:text-foreground transition-colors"
            title="Abrir paleta de comandos"
          >
            <Command size={11} />
            <span>K</span>
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
