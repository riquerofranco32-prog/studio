"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  label = "Copiar email",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: ${text}`}
      className={`focus-ring group relative inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted transition-all duration-300 hover:border-accent/40 hover:text-foreground active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400" />
          <span className="text-emerald-400">¡Copiado!</span>
        </>
      ) : (
        <>
          <Copy
            size={14}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
