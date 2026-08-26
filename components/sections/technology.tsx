"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Layers, Database, Sparkles, Palette } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { techStack } from "@/data/services";

type CategoryFilter = "all" | "frontend" | "backend" | "ai" | "design";

const categories: { id: CategoryFilter; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "all", label: "Todo el Stack", icon: Layers },
  { id: "frontend", label: "Frontend & Motion", icon: Cpu },
  { id: "backend", label: "Backend & Cloud", icon: Database },
  { id: "ai", label: "IA & APIs", icon: Sparkles },
  { id: "design", label: "Diseño & Craft", icon: Palette },
];

export function Technology() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");

  const filteredItems = techStack.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="Stack & Arquitectura"
            title="Tecnología moderna. Cero deuda técnica."
            subtitle="Seleccionamos herramientas de última generación para garantizar tiempos de carga instantáneos, alta disponibilidad y código mantenible."
          />
        </div>

        {/* Selector interactivo de categoría */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-all ${
                  isSelected
                    ? "border-accent bg-accent text-background font-medium shadow-[0_0_20px_rgba(255,77,46,0.25)]"
                    : "border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-background" : "text-accent"} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grilla dinámica de tecnologías */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((tech) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {tech.name}
                  </h3>
                  {tech.badge && (
                    <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {tech.badge}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
