"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { MagneticLink } from "@/components/ui/magnetic-link";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] opacity-40"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-foreground/[0.03] blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative">
        <p className="mb-6 font-mono text-xs tracking-widest text-muted uppercase">
          Digital product &amp; creative technology studio
        </p>

        <h1 className="max-w-4xl text-[2.75rem] leading-[1.05] font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl">
          <RevealText>We build digital experiences</RevealText>
          <RevealText delay={0.08}>for brands moving forward.</RevealText>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 max-w-md text-lg text-muted"
        >
          Strategy, design and technology — from first idea to final product.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <MagneticLink
            href="#work"
            className="text-sm font-medium text-foreground"
          >
            View our work <ArrowRight size={15} />
          </MagneticLink>
          <MagneticLink
            href="#contact"
            className="text-sm text-muted hover:text-foreground"
          >
            Start a project <ArrowRight size={15} />
          </MagneticLink>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
