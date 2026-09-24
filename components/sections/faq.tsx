"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/data/faq";
import { SITE } from "@/data/site";

// Misma fuente que la lista: si cambia una respuesta, cambia el schema.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

function StillHaveQuestions() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <HelpCircle size={18} className="text-accent" aria-hidden="true" />
        ¿Te quedó otra duda?
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Escribinos por WhatsApp o por email. Respondemos dentro de las 24 h
        hábiles.
      </p>
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:underline"
      >
        <MessageCircle size={16} aria-hidden="true" />
        Consultar por WhatsApp &rarr;
      </a>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" className="border-t border-border py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              title="Todo claro antes de empezar."
              subtitle="Precio, plazos y cómo trabajamos, respondido de entrada."
            />

            {/* En desktop va acá, debajo del título. En mobile este layout
                pasa a una sola columna y quedaría ANTES de la lista de
                preguntas — se oculta y se repite al final (ver más abajo),
                donde tiene sentido leerla: después de que ya viste las
                respuestas, no antes. */}
            <div className="mt-8 hidden lg:block">
              <StillHaveQuestions />
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {faqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const num = String(index + 1).padStart(2, "0");
                const buttonId = `faq-q-${faq.id}`;
                const panelId = `faq-a-${faq.id}`;

                return (
                  <li key={faq.id} className="group">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        className="focus-ring flex w-full items-start justify-between gap-4 py-5 text-left"
                      >
                        <span className="flex items-baseline gap-4">
                          <span
                            aria-hidden="true"
                            className="font-mono text-xs text-muted transition-colors group-hover:text-accent"
                          >
                            {num}
                          </span>
                          <span className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-accent md:text-xl">
                            {faq.question}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                            isOpen
                              ? "rotate-180 border-accent/40 bg-accent/10 text-accent"
                              : "border-border bg-surface text-muted group-hover:border-foreground/30"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </span>
                      </button>
                    </h3>

                    {/* Se desmonta cerrado: con el panel montado a alto 0 el
                        lector de pantalla y el Tab lo seguirían encontrando.
                        height es clave "posicional": con reduced-motion
                        <MotionProvider> la salta y deja sólo el fade. */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pl-8 text-base leading-relaxed text-muted md:text-lg">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 lg:hidden">
              <StillHaveQuestions />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
