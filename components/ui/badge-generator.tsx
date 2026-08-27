"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Copy, Check, Code2, ShieldCheck } from "lucide-react";
import { useSoundFx } from "@/components/providers/sound-provider";

export function BadgeGeneratorModal() {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"jsx" | "html" | "svg">("jsx");
  const [copied, setCopied] = useState(false);
  const { playClick, playSuccess } = useSoundFx();

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("open-badge-generator", handleOpen);
    return () => window.removeEventListener("open-badge-generator", handleOpen);
  }, []);

  const snippets = {
    jsx: `<a
  href="https://se7enstudios.com"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d0d10] px-3.5 py-1.5 font-mono text-xs text-white hover:border-[#ff4d2e] transition-colors"
>
  <span className="h-2 w-2 rounded-full bg-[#ff4d2e] animate-pulse" />
  <span>Built by <strong>Se7en Studio</strong> ⚡ 100/100</span>
</a>`,
    html: `<a href="https://se7enstudios.com" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:#0d0d10;border:1px solid rgba(255,255,255,0.1);border-radius:9999px;font-family:monospace;font-size:12px;color:#fff;text-decoration:none;">
  <span style="width:8px;height:8px;background:#ff4d2e;border-radius:50%;display:inline-block;"></span>
  <span>Built by <b>Se7en Studio</b> ⚡ 100/100</span>
</a>`,
    svg: `<svg width="220" height="36" viewBox="0 0 220 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="220" height="36" rx="18" fill="#0D0D10" stroke="#26262B"/>
  <circle cx="18" cy="18" r="4" fill="#FF4D2E"/>
  <text x="32" y="22" fill="#FFFFFF" font-family="monospace" font-size="12">Built by Se7en Studio ⚡</text>
</svg>`,
  };

  function handleCopy() {
    playSuccess();
    navigator.clipboard.writeText(snippets[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Sparkles size={16} />
                </span>
                <h3 className="font-semibold text-foreground text-base">
                  Insignia Oficial "Built by Se7en"
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Vista previa en vivo */}
            <div className="mt-6 rounded-2xl border border-border bg-background p-6 text-center flex flex-col items-center justify-center gap-3">
              <span className="font-mono text-[10px] text-muted uppercase">
                Vista previa del badge
              </span>

              <a
                href="https://se7enstudios.com"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d0d10] px-4 py-2 font-mono text-xs text-white shadow-[0_0_20px_rgba(255,77,46,0.2)]"
              >
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>
                  Built by <strong>Se7en Studio</strong> ⚡ 100/100
                </span>
              </a>
            </div>

            {/* Formato Selector */}
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">Formato de código:</span>
              <div className="flex rounded-lg border border-border bg-background p-0.5 font-mono text-xs">
                {(["jsx", "html", "svg"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      playClick();
                      setFormat(f);
                    }}
                    className={`rounded px-2.5 py-1 uppercase font-semibold transition-colors ${
                      format === f
                        ? "bg-accent text-background"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Snippet */}
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-[#0d0d10] p-3 font-mono text-xs text-muted">
              <pre className="overflow-x-auto p-1">
                <code>{snippets[format]}</code>
              </pre>
            </div>

            {/* Copy Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCopy}
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-background hover:bg-accent/90"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "¡Código Copiado!" : "Copiar Snippet"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
