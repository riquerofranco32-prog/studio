"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useInView } from "@/lib/use-in-view";
import { Project } from "@/types";

export function ProjectCard({
  project,
  className = "",
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.15);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link href={`/work/${project.slug}`} className="focus-ring group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted/60">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.name} preview`}
                fill
                priority={priority}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              {project.name}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute right-4 top-4 flex h-9 w-9 -translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted">
                {project.number}
              </span>
              <h3 className="text-xl font-medium tracking-tight text-foreground transition-opacity group-hover:opacity-70">
                {project.name}
              </h3>
            </div>
            <p className="mt-1 text-sm text-muted">{project.category}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
