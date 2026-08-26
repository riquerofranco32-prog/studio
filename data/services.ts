import { ProcessStep, Service } from "@/types";

export const services: Service[] = [
  {
    number: "01",
    title: "Experiencias Digitales",
    tagline: "Landing pages & Sitios de Marca",
    description:
      "Diseñamos y programamos landing pages inmersivas, sitios corporativos y experiencias interactivas que destacan tu propuesta y elevan la percepción de tu marca.",
    deliverables: ["Landing pages de alta conversión", "Sitios corporativos", "Motion & Micro-interacciones", "Optimización SEO"],
  },
  {
    number: "02",
    title: "E-Commerce",
    tagline: "Tiendas y Catálogos de Alta Conversión",
    description:
      "Catálogos digitales, sincronización de stock en tiempo real, flujos de checkout directos a WhatsApp o pasarelas de pago y paneles de gestión autoadministrables.",
    deliverables: ["Catálogos interactivos", "Checkout optimizado", "Panel de administración", "Integración de pagos"],
  },
  {
    number: "03",
    title: "Productos Digitales",
    tagline: "SaaS, Plataformas & Dashboards",
    description:
      "Diseñamos y desarrollamos aplicaciones web completas (SaaS), dashboards analíticos y sistemas a medida pensados para escalar desde el día uno.",
    deliverables: ["Arquitectura SaaS", "Dashboards y paneles", "Design systems", "Autenticación & Base de datos"],
  },
  {
    number: "04",
    title: "IA y Tecnología",
    tagline: "Automatización & Modelos Inteligentes",
    description:
      "Integración de modelos de lenguaje (LLMs), automatización de procesos internos, pipelines de datos en vivo y APIs personalizadas.",
    deliverables: ["Integraciones con OpenAI/Anthropic", "APIs a medida", "Procesamiento de datos", "Automatizaciones"],
  },
];

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Descubrir & Estrategia",
    duration: "Semana 1",
    description:
      "Analizamos tu negocio, modelo de monetización y audiencia. Definimos el alcance exacto, la arquitectura de contenidos y los objetivos clave de conversión.",
    deliverables: ["Brief estratégico", "Arquitectura de información", "Moodboard visual y referencias"],
  },
  {
    number: "02",
    title: "Diseñar & Prototipar",
    duration: "Semana 2",
    description:
      "Diseñamos la experiencia de usuario (UX) y la dirección de arte (UI). Creamos prototipos interactivos en Figma con estados, interacciones y responsive design.",
    deliverables: ["Wireframes y flujos de usuario", "Diseño UI desktop y mobile", "Prototipo interactivo navegable"],
  },
  {
    number: "03",
    title: "Construir & Animar",
    duration: "Semanas 3–4",
    description:
      "Escribimos código limpio, robusto y ultrarrápido con Next.js, TypeScript y Tailwind CSS. Implementamos animaciones fluidas a 60fps y conectamos bases de datos.",
    deliverables: ["Desarrollo frontend & backend", "Animaciones y micro-interacciones", "Entorno de pruebas (Staging) en vivo"],
  },
  {
    number: "04",
    title: "Lanzar & Optimizar",
    duration: "Lanzamiento",
    description:
      "Desplegamos en infraestructura global (Vercel/Cloudflare), configuramos dominios, realizamos auditoría de SEO/performance y brindamos soporte post-lanzamiento.",
    deliverables: ["Auditoría de Core Web Vitals (95+)", "Configuración de analítica y SEO", "30 días de garantía y soporte"],
  },
];

// Capacidades para la marquesina del hero — frases cortas, sin punto final.
export const capabilities = [
  "Estrategia de producto",
  "Diseño de interfaz",
  "Motion & interacción",
  "Desarrollo web",
  "E-commerce",
  "Integraciones de IA",
  "Identidad digital",
  "Performance & SEO",
];

export const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "Vercel",
  "IA",
  "APIs",
];
