"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Sparkles, UserCheck } from "lucide-react";
import { useSoundFx } from "@/components/providers/sound-provider";

export function FounderVoiceWave() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { playPop } = useSoundFx();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function togglePlay() {
    playPop();
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background transition-transform hover:scale-105 shrink-0"
            aria-label={isPlaying ? "Pausar nota de audio" : "Escuchar nota de los fundadores"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-0.5" />}
          </button>

          <div>
            <span className="font-mono text-[10px] text-accent uppercase font-bold tracking-wider">
              Nota de Audio · 25 seg
            </span>
            <h4 className="font-medium text-foreground text-xs">
              La Filosofía de Se7en Studio (Franco & Federico)
            </h4>
          </div>
        </div>

        <span className="font-mono text-[11px] text-muted">
          {isPlaying ? `00:${String(Math.round((progress / 100) * 25)).padStart(2, "0")}` : "00:25"}
        </span>
      </div>

      {/* Waveform Bars */}
      <div className="mt-4 flex items-center justify-between gap-1 h-8 px-1">
        {[20, 45, 75, 30, 90, 60, 40, 85, 95, 50, 65, 80, 35, 70, 90, 45, 60, 30, 80, 50, 65, 90, 35, 70, 40].map(
          (height, i) => {
            const barProgress = (i / 25) * 100;
            const isPassed = progress >= barProgress;
            return (
              <div
                key={i}
                style={{ height: `${isPlaying ? Math.max(15, (height * (progress % 20 + 5)) / 20) : height}%` }}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isPassed ? "bg-accent" : "bg-border"
                }`}
              />
            );
          }
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted leading-relaxed italic">
        &ldquo;No somos una agencia con 50 empleados delegando tu proyecto en juniors. Somos un estudio de 2 especialistas trabajando directo con vos.&rdquo;
      </p>
    </div>
  );
}
