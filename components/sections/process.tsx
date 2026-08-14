"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { process } from "@/data/services";

export function Process() {
  const [active, setActive] = useState(0);

  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <SectionHeading kicker="Process" title="How we build." />

        <div className="mt-16 flex flex-col gap-0 md:flex-row md:gap-8">
          <div className="flex flex-row overflow-x-auto md:flex-col md:overflow-visible">
            {process.map((step, i) => (
              <button
                key={step.number}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`focus-ring flex shrink-0 items-center gap-4 border-b border-border py-6 pr-10 text-left transition-colors md:w-72 md:border-b-0 md:border-l-2 md:pl-6 ${
                  active === i ? "md:border-l-foreground" : "md:border-l-border"
                }`}
              >
                <span
                  className={`font-mono text-sm transition-colors ${
                    active === i ? "text-foreground" : "text-muted"
                  }`}
                >
                  {step.number}
                </span>
                <span
                  className={`text-lg font-medium tracking-tight transition-colors ${
                    active === i ? "text-foreground" : "text-muted"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-10 min-h-[160px] flex-1 md:mt-0">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                Step {process[active].number}
              </p>
              <h3 className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                {process[active].title}
              </h3>
              <p className="mt-4 max-w-md text-lg text-muted">
                {process[active].description}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
