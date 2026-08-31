"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MD, useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Project } from "@/types";

const MOBILE_VIDEO_COUNT = 1;

export function HeroShowcase({
  projects,
  y,
}: {
  projects: Project[];
  y?: MotionValue<string>;
}) {
  const esDesktop = useMediaQuery(MD);
  const reduceMotion = useReducedMotion();
  const [montarVideo, setMontarVideo] = useState(false);

  useEffect(() => {
    const idle =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => setMontarVideo(true), { timeout: 2000 })
        : window.setTimeout(() => setMontarVideo(true), 300);
    return () => {
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, []);

  return (
    <motion.div
      data-hero-cards
      style={{
        gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))`,
        ...(y ? { y } : {}),
      }}
      className="
        flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        md:grid md:snap-none md:overflow-visible md:pb-0
      "
    >
      {projects.map((project, i) => {
        const conVideo =
          !reduceMotion &&
          montarVideo &&
          Boolean(project.video) &&
          (esDesktop || i < MOBILE_VIDEO_COUNT);

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            transitionTypes={["nav-forward"]}
            className="focus-ring group w-[85vw] shrink-0 snap-start md:w-auto"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(255,77,46,0.15)]">
              <Image
                src={project.image}
                alt={`${project.name} preview`}
                fill
                sizes="(min-width: 768px) 33vw, 85vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {conVideo && project.video && (
                <video
                  aria-hidden
                  autoPlay
                  muted
                  loop
                  playsInline
                  onCanPlay={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500"
                >
                  <source src={project.video.webm} type="video/webm" />
                  <source src={project.video.mp4} type="video/mp4" />
                </video>
              )}

              {/* Gradient Overlay & Hover Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-background/80 px-2.5 py-1 font-mono text-[10px] text-foreground backdrop-blur-md">
                {project.category.split("/")[0].trim()}
              </span>

              <span className="absolute top-3 right-3 flex h-8 w-8 -translate-y-2 items-center justify-center rounded-full bg-accent text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="flex items-baseline gap-2 text-sm">
                <span className="font-mono text-xs text-muted">{project.number}</span>
                <span className="font-medium text-foreground transition-colors duration-300 group-hover:text-accent">
                  {project.name}
                </span>
              </p>
              {project.impactMetric && (
                <span className="font-mono text-[11px] text-muted group-hover:text-foreground transition-colors">
                  {project.impactMetric}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </motion.div>
  );
}
