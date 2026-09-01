"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Code2,
  Sparkles,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Laptop,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSoundFx } from "@/components/providers/sound-provider";

interface ProcessStep {
  step: string;
  days: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  description: string;
  tasks: string[];
  deliverable: string;
}

const steps: ProcessStep[] = [
  {
    step: "01",
    days: "Días 1 a 3",
    title: "Kickoff & Dirección de Arte",
    tagline: "Estrategia, wireframes y prototipo interactivo",
    icon: MessageSquare,
    description:
      "Alineamos objetivos de negocio, arquitectura de información y creamos el diseño de alta fidelidad en Figma.",
    tasks: [
      "Canal directo en Slack o WhatsApp con los fundadores (Franco & Federico).",
      "Mapeo de flujos clave de usuario y arquitectura técnica.",
      "Prototipo interactivo en Figma navegable con diseño UI/UX aprobado.",
    ],
    deliverable: "Figma navegable aprobado y especificación técnica cerrada",
  },
  {
    step: "02",
    days: "Días 4 a 10",
    title: "Ingeniería & Staging en Vivo",
    tagline: "Desarrollo en Next.js 16 y bases de datos",
    icon: Code2,
    description:
      "Construimos componentes atómicos en React 19, Server Actions y persistencia con PostgreSQL.",
    tasks: [
      "Entorno privado de pruebas (staging.tudominio.com) para ver avances diarios.",
      "Componentes atómicos con Tailwind CSS v4 y TypeScript estricto.",
      "Integración de Supabase Postgres, autenticación segura y pasarelas de pago.",
    ],
    deliverable: "Entorno de Staging 100% funcional con datos reales",
  },
  {
    step: "03",
    days: "Días 11 a 16",
    title: "Motion, Polish & Core Web Vitals",
    tagline: "Experiencia fluida a 60 FPS y rendimiento 100/100",
    icon: Sparkles,
    description:
      "Implementamos micro-interacciones cinematográficas y optimizamos cada milisegundo de carga.",
    tasks: [
      "Transiciones fluidas y micro-animaciones con Framer Motion.",
      "Auditoría técnica de Core Web Vitals para garantizar 95-100 en Lighthouse.",
      "Pruebas de estrés y compatibilidad en iPhone, Android, Mac y Windows.",
    ],
    deliverable: "Lighthouse 100/100 y respuesta táctil instantánea",
  },
  {
    step: "04",
    days: "Días 17 a 21",
    title: "Lanzamiento Global & Garantía",
    tagline: "Despliegue perimetral en Edge y soporte directo",
    icon: Rocket,
    description:
      "Desplegamos en la red perimetral de Vercel y te entregamos la propiedad total del repositorio.",
    tasks: [
      "Configuración de DNS con Vercel Edge, SSL bancario y SEO Schema dinámico.",
      "Indexación en Google Search Console y OpenGraph para redes sociales.",
      "Transferencia del repositorio GitHub a tu nombre + 30 días de soporte post-lanzamiento.",
    ],
    deliverable: "Producto en producción + Repositorio GitHub 100% tuyo",
  },
];

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const { playClick } = useSoundFx();

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <section id="process" className="border-t border-border py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="Metodología & Velocidad"
            title="De la idea a producción en 2 a 3 semanas."
            subtitle="Un proceso estructurado, transparente y sin burocracia: sabés exactamente qué se entrega cada semana."
          />

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-background transition-colors hover:bg-accent/90"
            >
              <span>Iniciar un proyecto</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Timeline / Selector de Pasos en Barra Horizontal */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => {
            const StepIcon = item.icon;
            const isSelected = activeStep === idx;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveStep(idx);
                }}
                className={`focus-ring relative text-left rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? "border-accent bg-surface"
                    : "border-border bg-surface/50 hover:border-foreground/30 hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">
                    Paso {item.step}
                  </span>
                  <span className="font-mono text-[10px] rounded-full border border-border bg-background px-2 py-0.5 text-muted">
                    {item.days}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </h4>

                <p className="mt-1 text-xs text-muted line-clamp-1">
                  {item.tagline}
                </p>

                {isSelected && (
                  <motion.div
                    layoutId="process-indicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Detalle Dinámico del Paso Activo */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/80 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
                <Icon size={24} />
              </div>
              <div>
                <span className="font-mono text-xs text-accent uppercase font-bold">
                  Paso {current.step} · {current.days}
                </span>
                <h3 className="display mt-0.5 text-2xl text-foreground sm:text-3xl">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/5 px-4 py-2 font-mono text-xs text-foreground">
              <span className="text-accent font-semibold">Entregable:</span>
              <span className="text-muted">{current.deliverable}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {current.tasks.map((task, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-background/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <p className="text-xs leading-relaxed text-muted">{task}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Micro Footer del Paso */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-xs font-mono text-muted">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-accent" />
              Entregas continuas y visibilidad diaria en staging
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Garantía de 30 días post-lanzamiento incluida
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
