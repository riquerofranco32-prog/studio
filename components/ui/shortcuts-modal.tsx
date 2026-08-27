"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X, Command, Sparkles } from "lucide-react";
import { useSoundFx } from "@/components/providers/sound-provider";

interface ShortcutGroup {
  category: string;
  items: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    category: "Navegación Rápida",
    items: [
      { keys: ["G", "H"], description: "Ir al Inicio (Home)" },
      { keys: ["G", "W"], description: "Ir al Portafolio (/work)" },
      { keys: ["G", "S"], description: "Ir a Servicios (/services)" },
      { keys: ["G", "B"], description: "Iniciar Briefing (/start)" },
      { keys: ["G", "R"], description: "Calculadora de ROI (/roi)" },
    ],
  },
  {
    category: "Herramientas & Comandos",
    items: [
      { keys: ["⌘ / Ctrl", "K"], description: "Abrir Paleta de Comandos" },
      { keys: ["?"], description: "Abrir este panel de atajos" },
      { keys: ["M"], description: "Activar / Silenciar efectos de sonido" },
      { keys: ["ESC"], description: "Cerrar modal o ventana activa" },
    ],
  },
];

export function ShortcutsModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toggleSound, playClick } = useSoundFx();

  useEffect(() => {
    let pendingGKey = false;
    let gTimeout: NodeJS.Timeout | null = null;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignorar si el usuario está escribiendo en un input o textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleSound();
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        pendingGKey = true;
        if (gTimeout) clearTimeout(gTimeout);
        gTimeout = setTimeout(() => {
          pendingGKey = false;
        }, 1200);
        return;
      }

      if (pendingGKey) {
        pendingGKey = false;
        if (gTimeout) clearTimeout(gTimeout);
        const k = e.key.toLowerCase();

        if (k === "h") {
          playClick();
          router.push("/");
        } else if (k === "w") {
          playClick();
          router.push("/work");
        } else if (k === "s") {
          playClick();
          router.push("/services");
        } else if (k === "b") {
          playClick();
          router.push("/start");
        } else if (k === "r") {
          playClick();
          router.push("/roi");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gTimeout) clearTimeout(gTimeout);
    };
  }, [router, toggleSound, playClick]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Keyboard size={16} />
                </span>
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    Atajos de Teclado Profesionales
                  </h3>
                  <p className="text-xs text-muted">
                    Navegá todo el sitio a la velocidad del pensamiento
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg p-1 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto p-5 space-y-6">
              {shortcutGroups.map((group) => (
                <div key={group.category}>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted font-bold mb-3">
                    {group.category}
                  </h4>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3.5 py-2 text-xs"
                      >
                        <span className="text-muted">{item.description}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((k) => (
                            <kbd
                              key={k}
                              className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground shadow-xs"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-surface-2/40 px-5 py-3 text-center font-mono text-[10px] text-muted">
              <span>Presioná <kbd className="rounded border border-border px-1 py-0.5 bg-background">ESC</kbd> para cerrar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
