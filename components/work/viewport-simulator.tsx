"use client";

import { useState } from "react";
import Image from "next/image";
import { Laptop, Smartphone, Tablet, ExternalLink, Sparkles } from "lucide-react";
import { useSoundFx } from "@/components/providers/sound-provider";

interface ViewportSimulatorProps {
  imageSrc: string;
  projectName: string;
  videoSrc?: {
    mp4: string;
    webm: string;
  };
  liveUrl?: string;
}

export function ViewportSimulator({
  imageSrc,
  projectName,
  videoSrc,
  liveUrl,
}: ViewportSimulatorProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const { playClick, playPop } = useSoundFx();

  return (
    <div className="mt-12 rounded-3xl border border-border bg-surface p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <span className="font-mono text-xs text-accent uppercase font-semibold">
            Simulador de Dispositivos Responsive
          </span>
          <h3 className="font-semibold text-foreground text-lg mt-1">
            Inspeccionar en múltiples pantallas
          </h3>
        </div>

        {/* Selector de Dispositivos */}
        <div className="flex rounded-xl border border-border bg-background p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              playClick();
              setDevice("desktop");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
              device === "desktop"
                ? "bg-accent text-background font-bold"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Laptop size={14} />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setDevice("tablet");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
              device === "tablet"
                ? "bg-accent text-background font-bold"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setDevice("mobile");
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
              device === "mobile"
                ? "bg-accent text-background font-bold"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Frame de Simulación */}
      <div className="mt-8 flex justify-center py-6 bg-background/50 rounded-2xl border border-border/60 overflow-hidden min-h-[420px] items-center">
        {device === "desktop" && (
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-black shadow-2xl transition-all duration-300">
            {/* Barra de Ventana MacBook */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1f] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-[11px] text-white/50">
                https://{projectName.toLowerCase().replace(/\s+/g, "")}.com
              </span>
              <div className="w-12" />
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
              {videoSrc ? (
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source src={videoSrc.webm} type="video/webm" />
                  <source src={videoSrc.mp4} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={imageSrc}
                  alt={projectName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>
        )}

        {device === "tablet" && (
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border-4 border-[#2c2c34] bg-black shadow-2xl transition-all duration-300">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
              {videoSrc ? (
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source src={videoSrc.webm} type="video/webm" />
                  <source src={videoSrc.mp4} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={imageSrc}
                  alt={projectName}
                  fill
                  sizes="600px"
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>
        )}

        {device === "mobile" && (
          <div className="relative w-[320px] overflow-hidden rounded-[40px] border-4 border-[#2c2c34] bg-black shadow-2xl transition-all duration-300">
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 h-5 w-24 rounded-full bg-black border border-white/10" />

            <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-surface pt-4">
              {videoSrc ? (
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source src={videoSrc.webm} type="video/webm" />
                  <source src={videoSrc.mp4} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={imageSrc}
                  alt={projectName}
                  fill
                  sizes="320px"
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
