"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { useSoundFx } from "@/components/providers/sound-provider";

interface SuccessStory {
  id: string;
  clientName: string;
  role: string;
  company: string;
  category: "saas" | "ecommerce" | "ai" | "gastronomy";
  metric: string;
  metricLabel: string;
  quote: string;
  projectSlug?: string;
  liveUrl?: string;
}

const stories: SuccessStory[] = [
  {
    id: "story-1",
    clientName: "Equipo Fundador",
    role: "Operaciones & Producto",
    company: "Takefyy",
    category: "saas",
    metric: "0% Comisiones",
    metricLabel: "Ahorro de miles de USD mensuales en marketplaces",
    quote:
      "Pasamos de pagar el 25% de cada venta en apps tradicionales a tener nuestra propia plataforma con pedidos directos en tiempo real. La estabilidad de Supabase y la velocidad de carga es impecable.",
    projectSlug: "takefyy",
  },
  {
    id: "story-2",
    clientName: "Dirección de Marca",
    role: "E-Commerce & Marketing",
    company: "Poné La Pava",
    category: "ecommerce",
    metric: "+180% Conversión",
    metricLabel: "Crecimiento interanual en ventas de yerba mate",
    quote:
      "Nuestra web anterior en WordPress tardaba más de 5 segundos en abrir en teléfonos. Con el rediseño en Next.js las ventas online se dispararon porque la experiencia es instantánea.",
    projectSlug: "pone-la-pava",
  },
  {
    id: "story-3",
    clientName: "CTO & Lead Engineer",
    role: "Sistemas & Seguridad",
    company: "Sentinel Cloud",
    category: "ai",
    metric: "-60% Latencia",
    metricLabel: "Monitoreo perimetral y respuesta de agentes",
    quote:
      "La integración de Server Actions con streaming de datos en el Edge nos permitió entregar una consola técnica a la altura de plataformas de Silicon Valley.",
    projectSlug: "sentinel",
  },
  {
    id: "story-4",
    clientName: "Fundador",
    role: "Desarrollo de Negocios",
    company: "Apex AI",
    category: "ai",
    metric: "100/100 Lighthouse",
    metricLabel: "Puntuación perfecta de SEO y Core Web Vitals",
    quote:
      "Trabajar con dos ingenieros que entienden tanto de código estricto como de diseño atómico en Figma es una ventaja competitiva brutal para cualquier startup.",
    projectSlug: "apex-ai",
  },
  {
    id: "story-5",
    clientName: "Dirección General",
    role: "Gestión de Marca",
    company: "Pravilo Studio",
    category: "ecommerce",
    metric: "60 FPS Fluidos",
    metricLabel: "Experiencia inmersiva con animaciones de resortes",
    quote:
      "Lograron plasmar la identidad de nuestra marca con una elegancia visual y una fluidez en el scroll que no vimos en ninguna otra agencia.",
    projectSlug: "pravilo",
  },
  {
    id: "story-6",
    clientName: "Fundador",
    role: "Sistemas & Tecnología",
    company: "Aura Climate Tech",
    category: "saas",
    metric: "< 0.4s FCP",
    metricLabel: "Visualización de datos climáticos en tiempo real",
    quote:
      "La claridad de los sprints y la transparencia del portal de Staging hicieron que lanzar la plataforma fuera un proceso sin ninguna fricción.",
    projectSlug: "aura",
  },
];

const categories = [
  { id: "all", label: "Todas las historias" },
  { id: "saas", label: "SaaS & Software" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "ai", label: "Inteligencia Artificial" },
];

export function TestimonialsClient() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const { playClick, playPop } = useSoundFx();

  const filteredStories = useMemo(() => {
    return stories.filter((s) => selectedCat === "all" || s.category === selectedCat);
  }, [selectedCat]);

  return (
    <main className="min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <Star size={13} className="text-accent fill-accent" />
            <span>Muro de Casos & Prueba Social Verificada</span>
          </div>

          <h1 className="display mt-6 text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Resultados medibles <br />
            <span className="text-accent">en productos reales.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
            Mirá cómo ayudamos a fundadores, startups y marcas a eliminar comisiones, multiplicar ventas y posicionarse en la cima de su industria.
          </p>
        </div>

        {/* Filtros por Categoría */}
        <div className="mt-12 flex flex-wrap gap-2 border-y border-border py-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playClick();
                setSelectedCat(cat.id);
              }}
              className={`focus-ring rounded-xl px-4 py-2 font-mono text-xs transition-all ${
                selectedCat === cat.id
                  ? "bg-accent text-background font-bold"
                  : "bg-surface text-muted hover:text-foreground border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grilla de Casos */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-7 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2/60 shadow-lg"
            >
              <div>
                {/* Métricas destacadas */}
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <div>
                    <span className="display text-xl font-bold text-accent">
                      {story.metric}
                    </span>
                    <p className="font-mono text-[10px] text-muted mt-0.5">
                      {story.metricLabel}
                    </p>
                  </div>

                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-accent text-accent" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="mt-5 text-sm italic leading-relaxed text-foreground/90">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground text-xs">
                    {story.clientName}
                  </h4>
                  <span className="font-mono text-[11px] text-muted">
                    {story.role} · <strong>{story.company}</strong>
                  </span>
                </div>

                {story.projectSlug && (
                  <Link
                    href={`/work/${story.projectSlug}`}
                    className="focus-ring inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline font-semibold"
                  >
                    <span>Ver caso</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="mt-20 rounded-3xl border border-border bg-surface p-8 md:p-12 text-center flex flex-col items-center">
            <h3 className="display text-2xl sm:text-3xl text-foreground">
              ¿Querés que tu producto sea nuestro próximo caso de éxito?
            </h3>
            <p className="mt-2 text-sm text-muted max-w-md">
              Configurá tu brief en 3 minutos o solicitá una auditoría técnica gratuita.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/start"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background hover:bg-accent/90"
              >
                <span>Armar Brief Interactivo</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/audit"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-muted hover:text-foreground"
              >
                <span>Auditoría Gratuita en Video</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
