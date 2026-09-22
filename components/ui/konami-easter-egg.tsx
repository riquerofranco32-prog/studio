"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageCircle } from "lucide-react";
import { useSoundFx } from "@/components/providers/sound-provider";
import { SITE } from "@/data/site";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// Detalle escondido para quien explora hasta el fondo: el código Konami.
// No hay nada que fabricar (ni descuento, ni promesa comercial) — sólo un
// gesto de marca para quien reconoce la referencia.
export function KonamiEasterEgg() {
  const [open, setOpen] = useState(false);
  const { playSuccess } = useSoundFx();

  useEffect(() => {
    let progress = 0;

    function handleKeyDown(e: KeyboardEvent) {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName,
        )
      ) {
        return;
      }

      const expected = KONAMI_CODE[progress];
      const matches = e.key === expected || e.key.toLowerCase() === expected;

      progress = matches ? progress + 1 : 0;

      if (progress === KONAMI_CODE.length) {
        progress = 0;
        setOpen(true);
        playSuccess();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playSuccess]);

  const whatsappUrl = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Hola! Encontré el código konami en su web 👀",
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-6 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm rounded-2xl border border-accent/40 bg-surface p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="focus-ring absolute right-4 top-4 text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Sparkles size={22} />
            </div>

            <h3 className="display mt-5 text-xl text-foreground">
              Encontraste el modo secreto.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Arriba, arriba, abajo, abajo... ya sabemos que sos de los que
              exploran hasta el fondo del código. Si te gusta ese tipo de
              detalle, probablemente te guste cómo trabajamos.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/90"
            >
              <MessageCircle size={16} />
              <span>Saludanos por WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
