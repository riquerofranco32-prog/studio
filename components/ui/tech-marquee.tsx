"use client";

import { Marquee } from "@/components/ui/marquee";
import { Zap, ShieldCheck, Cpu, Flame, Database, Globe, Layers, Sparkles } from "lucide-react";

interface TechBadge {
  name: string;
  category: string;
  metric: string;
  icon: React.ElementType;
}

const techs: TechBadge[] = [
  { name: "Next.js 16", category: "Framework", metric: "Turbopack 1.8s", icon: Flame },
  { name: "React 19", category: "Core UI", metric: "Server Actions", icon: Cpu },
  { name: "Supabase", category: "Database", metric: "Postgres + RLS", icon: Database },
  { name: "Tailwind CSS v4", category: "Styling", metric: "< 15 KB CSS", icon: Layers },
  { name: "TypeScript 5", category: "Safety", metric: "100% Strict Typecheck", icon: ShieldCheck },
  { name: "Vercel Edge", category: "Infra", metric: "< 35ms TTFB Global", icon: Globe },
  { name: "Framer Motion", category: "Animation", metric: "60 FPS GPU Physics", icon: Sparkles },
  { name: "Claude 3.7", category: "AI & Models", metric: "Streaming Agents", icon: Zap },
];

export function TechMarquee() {
  return (
    <div className="border-y border-border bg-surface-2/30 py-6 overflow-hidden">
      <Marquee duration={35} className="py-1">
        <div className="flex items-center gap-6 pr-6">
          {techs.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="group flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-xs transition-colors hover:border-accent/40"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon size={12} />
                </div>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="font-semibold text-foreground">{tech.name}</span>
                  <span className="text-[10px] text-accent opacity-80">{tech.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
}
