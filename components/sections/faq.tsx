"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/data/faq";
import { SITE } from "@/data/site";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

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
                ¿Tenés otra consulta?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Escribinos directamente a nuestro WhatsApp o envianos un email. Te respondemos en menos de 24 horas.
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
            <div className="flex flex-col divide-y divide-border border-y border-border">
              {faqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const num = String(index + 1).padStart(2, "0");

                return (
                  <div key={faq.id} className="group py-5 transition-colors">
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
