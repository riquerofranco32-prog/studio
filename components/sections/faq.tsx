"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Layers, Clock, Cpu, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/data/faq";
import { SITE } from "@/data/site";

type FAQCategory = "all" | "pricing" | "tech" | "support" | "process";

const categories: { id: FAQCategory; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "all", label: "Todas", icon: Layers },
  { id: "pricing", label: "Tiempos & Inversión", icon: Clock },
  { id: "tech", label: "Stack & Arquitectura", icon: Cpu },
  { id: "support", label: "Garantía & Soporte", icon: ShieldCheck },
];

export function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              kicker="Preguntas Frecuentes"
              title="Todo claro antes de empezar."
              subtitle="Resolvemos las dudas más habituales sobre cómo trabajamos, plazos y metodología."
            />

            <div className="mt-8 rounded-xl border border-border bg-surface p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <HelpCircle size={18} className="text-accent" />
                ¿Tenés otra consulta específica?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Escribinos directamente a nuestro WhatsApp o envianos un email. Te respondemos en menos de 2 horas.
              </p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:underline"
              >
                <MessageCircle size={16} />
                Consultar por WhatsApp &rarr;
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            {/* Buscador + Categorías */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-all ${
                        isSelected
                          ? "border-accent bg-accent text-background font-medium"
                          : "border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      <Icon size={12} className={isSelected ? "text-background" : "text-accent"} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input de Búsqueda Rápida */}
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar preguntas..."
                  className="focus-ring w-full rounded-lg border border-border bg-surface py-1.5 px-3 text-xs text-foreground placeholder:text-muted/60 focus:border-accent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-[10px] text-muted hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-border border-y border-border">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openId === faq.id;
                  const num = String(index + 1).padStart(2, "0");

                  return (
                    <motion.div
                      key={faq.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group py-5 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(faq.id)}
                        aria-expanded={isOpen}
                        className="focus-ring flex w-full items-start justify-between gap-4 text-left"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                            {num}
                          </span>
                          <span className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-accent md:text-xl">
                            {faq.question}
                          </span>
                        </span>
                        <span
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-transform duration-300 ${
                            isOpen
                              ? "rotate-180 border-accent/40 bg-accent/10 text-accent"
                              : "text-muted group-hover:border-foreground/30"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 pl-8 text-base leading-relaxed text-muted md:text-lg">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
