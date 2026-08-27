"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface VideoData {
  mp4: string;
  webm: string;
  title: string;
  projectSlug: string;
}

export function VideoTheaterModal() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function handleOpen(e: CustomEvent<VideoData>) {
      setVideoData(e.detail);
      setIsPlaying(true);
      setIsMuted(true);
    }

    window.addEventListener("open-video-theater" as unknown as keyof WindowEventMap, handleOpen as EventListener);
    return () => {
      window.removeEventListener("open-video-theater" as unknown as keyof WindowEventMap, handleOpen as EventListener);
    };
  }, []);

  function togglePlay() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }

  if (!videoData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setVideoData(null)}
          className="fixed inset-0 bg-background/90 backdrop-blur-xl"
        />

        {/* Modal Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-[#0a0a0c] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <h3 className="font-medium text-foreground text-sm">
                {videoData.title} — Video Showcase
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/work/${videoData.projectSlug}`}
                onClick={() => setVideoData(null)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-muted hover:text-foreground transition-colors"
              >
                <span>Ver ficha</span>
                <ExternalLink size={12} />
              </Link>

              <button
                type="button"
                onClick={() => setVideoData(null)}
                className="focus-ring rounded-full p-1.5 text-muted hover:bg-surface hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Element */}
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlay}
              className="h-full w-full object-contain cursor-pointer"
            >
              <source src={videoData.webm} type="video/webm" />
              <source src={videoData.mp4} type="video/mp4" />
            </video>

            {/* Controles flotantes */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-background/70 px-4 py-2 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-foreground hover:text-accent transition-colors"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-foreground hover:text-accent transition-colors"
                  aria-label={isMuted ? "Activar audio" : "Silenciar"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <span className="font-mono text-[11px] text-muted">
                Se7en Studio 60 FPS Video Theater
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
