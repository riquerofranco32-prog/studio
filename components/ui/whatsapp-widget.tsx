"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { SITE } from "@/data/site";
import { useSoundFx } from "@/components/providers/sound-provider";

interface IntentOption {
  icon: string;
  label: string;
  text: string;
}

const intents: IntentOption[] = [
  {
    icon: "🚀",
    label: "Cotizar nuevo proyecto / SaaS",
    text: "Hola Franco y Federico! Quiero cotizar el desarrollo de un nuevo producto digital con Se7en Studio.",
  },
  {
    icon: "⚡",
    label: "Migrar de WordPress o Shopify",
    text: "Hola equipo! Nos interesa migrar nuestro sitio actual a Next.js 16 para mejorar velocidad y eliminar comisiones.",
  },
  {
    icon: "📅",
    label: "Agendar Discovery Call (15 min)",
    text: "Hola! Me gustaría coordinar una videollamada breve de 15 minutos para contarles sobre nuestro proyecto.",
  },
  {
    icon: "💡",
    label: "Consulta personalizada",
    text: "Hola Se7en Studio! Tengo una consulta sobre sus servicios de desarrollo y diseño.",
  },
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const { playClick, playPop, playSuccess } = useSoundFx();

  function handleSend(text: string) {
    playSuccess();
    const cleanNumber = SITE.whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customMessage.trim()) return;
    handleSend(customMessage);
    setCustomMessage("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Ventana Emergente de Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
          >
            {/* Header del Chat */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-mono text-sm font-bold backdrop-blur-md">
                      7
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-emerald-600 bg-emerald-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">
                      Se7en Studio Directo
                    </h3>
                    <p className="text-[11px] text-white/90">
                      Franco & Federico · En línea
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setOpen(false);
                  }}
                  className="rounded-full bg-black/10 p-1.5 text-white/80 hover:bg-black/20 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 rounded-xl bg-black/15 p-2.5 text-xs leading-relaxed text-white/95 backdrop-blur-xs">
                👋 ¡Hola! ¿En qué podemos ayudarte hoy? Elegí una opción rápida o escribinos tu mensaje:
              </div>
            </div>

            {/* Opciones Rápidas */}
            <div className="max-h-[320px] overflow-y-auto p-4 space-y-2">
              {intents.map((intent) => (
                <button
                  key={intent.label}
                  type="button"
                  onClick={() => handleSend(intent.text)}
                  className="focus-ring group w-full text-left rounded-2xl border border-border bg-surface-2/60 p-3 text-xs transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{intent.icon}</span>
                    <span className="font-medium text-foreground group-hover:text-emerald-400 transition-colors">
                      {intent.label}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-muted group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>

            {/* Input de Mensaje Personalizado */}
            <form
              onSubmit={handleCustomSubmit}
              className="border-t border-border bg-surface p-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribí un mensaje..."
                className="focus-ring w-full rounded-full border border-border bg-background py-2 px-4 text-xs text-foreground placeholder:text-muted focus:border-emerald-500"
              />
              <button
                type="submit"
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shrink-0"
                aria-label="Enviar"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante Principal */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playPop();
          setOpen((prev) => !prev);
        }}
        className="focus-ring group relative flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-500 px-4 py-3 text-xs font-semibold text-white shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-600 hover:shadow-[0_4px_30px_rgba(16,185,129,0.6)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>

        <MessageCircle size={17} />
        <span className="hidden sm:inline">WhatsApp directo</span>
      </motion.button>
    </div>
  );
}
