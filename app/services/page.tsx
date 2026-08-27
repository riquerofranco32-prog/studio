import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  Layout,
  ShoppingCart,
  Bot,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { services, process } from "@/data/services";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Servicios y Entregables | Se7en Studio",
  description:
    "Desarrollo SaaS, E-commerce de alta conversión, landing pages interactivas e integraciones con Inteligencia Artificial. Conoce nuestros paquetes y entregables.",
  openGraph: {
    title: "Servicios y Entregables | Se7en Studio",
    description:
      "Desarrollo SaaS, E-commerce de alta conversión, landing pages interactivas e integraciones con Inteligencia Artificial. Conoce nuestros paquetes y entregables.",
    url: `${SITE.url}/services`,
  },
};

const detailedServices = [
  {
    number: "01",
    id: "saas",
    title: "Desarrollo SaaS & Plataformas Web",
    tagline: "Aplicaciones web completas diseñadas para escalar",
    icon: Layout,
    timeline: "2 a 4 semanas",
    description:
      "Construimos plataformas digitales robustas desde la base de datos hasta la interfaz de usuario. Integramos autenticación, roles de usuario, pasarelas de pago y paneles administrativos en tiempo real.",
    deliverables: [
      "Arquitectura completa en Next.js 16 + React 19",
      "Base de datos PostgreSQL relacional en Supabase con RLS",
      "Autenticación segura (Magic Link, OAuth, contraseñas)",
      "Paneles de administración y dashboards analíticos",
      "Integración de pagos (Stripe, MercadoPago, Lemonsqueezy)",
      "Despliegue automatizado con CI/CD en Vercel",
    ],
    idealFor: "Startups, fundadores técnicos y empresas que necesitan lanzar un MVP o escalar su producto.",
  },
  {
    number: "02",
    id: "ecommerce",
    title: "E-Commerce & Experiencias de Marca",
    tagline: "Tiendas ultrarrápidas pensadas para maximizar ventas",
    icon: ShoppingCart,
    timeline: "2 a 3 semanas",
    description:
      "Desarrollamos tiendas online personalizadas que cargan al instante y convierten visitas en compradores. Sin los límites de diseño ni la lentitud de Shopify o WooCommerce estándar.",
    deliverables: [
      "Catálogo de productos interactivo y autogestionable",
      "Flujo de checkout fluido (directo a WhatsApp o pasarela de pago)",
      "Gestión de stock e inventario en tiempo real",
      "Optimización de velocidad (Core Web Vitals 95+)",
      "Panel de administración intuitivo para cargar productos",
      "Integración con Google Analytics 4 y Meta Pixel",
    ],
    idealFor: "Marcas direct-to-consumer (D2C), comercios gastronómicos y negocios con identidad propia.",
  },
  {
    number: "03",
    id: "landing",
    title: "Landing Pages & Sitios de Marca",
    tagline: "Presencia digital premium de altísimo impacto visual",
    icon: Zap,
    timeline: "1 a 2 semanas",
    description:
      "Creamos la cara digital de tu empresa con una dirección de arte impecable, animaciones fluidas a 60fps y una estructura orientada a la conversión y credibilidad inmediata.",
    deliverables: [
      "Diseño UI/UX a medida en Figma con prototipo interactivo",
      "Desarrollo frontend en Next.js con Tailwind CSS v4",
      "Animaciones micro-interactivas con Framer Motion",
      "Formularios de contacto inteligentes con anti-spam",
      "Estructura SEO semántica y OpenGraph dinámico para redes",
      "Adaptabilidad 100% responsiva (móvil, tablet y desktop)",
    ],
    idealFor: "Empresas de servicios, consultoras, lanzamientos de producto y marcas que buscan diferenciarse.",
  },
  {
    number: "04",
    id: "ai",
    title: "Inteligencia Artificial & Automatización",
    tagline: "APIs inteligentes y flujos de datos en tiempo real",
    icon: Bot,
    timeline: "2 a 3 semanas",
    description:
      "Potenciamos tu producto con modelos de lenguaje de última generación (OpenAI, Anthropic), procesamiento de datos satelitales o fuentes en vivo y automatizaciones personalizadas.",
    deliverables: [
      "Integración de LLMs (asistentes, búsqueda semántica, resúmenes)",
      "Pipelines de consumo de datos externos (APIs, Satélites)",
      "Automatización de workflows internos y notificaciones",
      "Optimización de costos de tokens e inferencia",
      "Manejo seguro de claves y rate-limiting",
    ],
    idealFor: "Productos de Climate Tech, herramientas SaaS inteligentes y empresas con flujos repetitivos.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 md:pt-36 md:pb-32">
      <Container>
        {/* Cabecera Principal */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <Sparkles size={13} className="text-accent" />
            <span>Servicios & Entregables</span>
          </div>

          <h1 className="display mt-6 text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Ingeniería y diseño. <br />
            <span className="text-accent">Sin atajos ni plantillas.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
            Desarrollamos soluciones digitales a medida con foco en velocidad, diseño editorial y código limpio bajo tu propiedad absoluta.
          </p>
        </div>

        {/* Garantías y Pilares rápidos */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface/60 p-6">
            <ShieldCheck className="text-accent" size={24} />
            <h3 className="mt-3 font-medium text-foreground">30 Días de Garantía</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Soporte técnico y ajustes post-lanzamiento sin costo adicional para asegurar estabilidad total.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface/60 p-6">
            <Code2 className="text-accent" size={24} />
            <h3 className="mt-3 font-medium text-foreground">100% Código Propio</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Repositorio de GitHub a tu nombre. Sin ataduras a plataformas propietarias ni suscripciones ocultas.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface/60 p-6">
            <Rocket className="text-accent" size={24} />
            <h3 className="mt-3 font-medium text-foreground">Entregas en 1-3 Semanas</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Sprints semanales con demos tangibles en staging. Sin burocracias de agencias tradicionales.
            </p>
          </div>
        </div>

        {/* Desglose Detallado de Servicios */}
        <div className="mt-20 space-y-12">
          {detailedServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/40 lg:p-12"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Icon size={20} />
                      </span>
                      <span className="font-mono text-xs text-muted uppercase tracking-widest">
                        Servicio {service.number}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted">
                        <Clock size={11} className="text-accent" />
                        {service.timeline}
                      </span>
                    </div>

                    <h2 className="display mt-6 text-2xl text-foreground sm:text-3xl lg:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-2 text-base font-medium text-accent">
                      {service.tagline}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-muted">
                      {service.description}
                    </p>

                    <div className="mt-4 rounded-lg bg-background/80 border border-border/80 p-3.5 text-xs text-muted">
                      <strong className="text-foreground">Ideal para:</strong> {service.idealFor}
                    </div>
                  </div>

                  {/* Lista de Entregables */}
                  <div className="w-full lg:max-w-md rounded-xl border border-border/80 bg-background/50 p-6">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-medium mb-4 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-accent" />
                      Entregables incluidos:
                    </h3>
                    <ul className="space-y-2.5">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-muted"
                        >
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                      <Link
                        href="/#estimator"
                        className="focus-ring inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                      >
                        <span>Calcular presupuesto</span>
                        <ArrowRight size={12} />
                      </Link>
                      <Link
                        href="/#contact"
                        className="focus-ring inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground"
                      >
                        <span>Consultar</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceso y Metodología */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-mono text-xs tracking-widest uppercase text-muted">
              Metodología de trabajo
            </span>
            <h2 className="display mt-3 text-3xl text-foreground md:text-4xl">
              De la idea al despliegue en 4 pasos.
            </h2>
            <p className="mt-3 text-base text-muted">
              Un flujo ágil, sin reuniones innecesarias y con comunicación directa con los desarrolladores y diseñadores.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted">
                    {step.duration}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner en /services */}
        <Reveal>
          <div className="mt-20 rounded-2xl border border-accent/30 bg-surface p-8 md:p-12 text-center flex flex-col items-center justify-center">
            <h3 className="display text-3xl text-foreground sm:text-4xl">
              ¿Listo para empezar tu proyecto?
            </h3>
            <p className="mt-3 max-w-lg text-base text-muted">
              Contanos sobre tu idea y te armamos una propuesta técnica con cotización y fecha estimada de entrega.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-background transition-all hover:bg-accent/90 hover:shadow-[0_0_25px_rgba(255,77,46,0.35)]"
              >
                <span>Hablemos de tu idea</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/work"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <span>Ver proyectos anteriores</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
