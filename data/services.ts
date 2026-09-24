import { ProcessStep, Service, TechStackItem } from "@/types";

export const services: Service[] = [
  {
    number: "01",
    title: "Experiencias Digitales",
    tagline: "Landing pages y sitios de marca",
    description:
      "Landings y sitios corporativos que explican rápido qué hacés y hacen que tu marca se vea como tiene que verse.",
    deliverables: [
      "Landing pages",
      "Sitios corporativos",
      "Animaciones y detalles",
      "SEO técnico",
    ],
  },
  {
    number: "02",
    title: "E-Commerce",
    tagline: "Tiendas y catálogos",
    description:
      "Catálogos con stock en tiempo real, checkout por WhatsApp o pasarela de pago y un panel para que lo gestiones vos.",
    deliverables: [
      "Catálogo interactivo",
      "Checkout optimizado",
      "Panel de gestión",
      "Pagos online",
    ],
  },
  {
    number: "03",
    title: "Productos Digitales",
    tagline: "Plataformas y paneles a medida",
    description:
      "Plataformas web y paneles de control a medida, con usuarios, datos y permisos, pensados para crecer con tu negocio.",
    deliverables: [
      "Plataformas a medida",
      "Paneles de control",
      "Usuarios y permisos",
      "Sistema de diseño",
    ],
  },
  {
    number: "04",
    title: "IA y Automatización",
    tagline: "Procesos que se hacen solos",
    description:
      "Sumamos IA para sacarte de encima las tareas repetitivas, conectar tus sistemas y tener tus datos siempre al día.",
    deliverables: [
      "Asistentes con IA",
      "Integraciones entre sistemas",
      "Datos en tiempo real",
      "Tareas automáticas",
    ],
  },
];

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Descubrir & Estrategia",
    duration: "Semana 1",
    description:
      "Analizamos tu negocio, cómo generás ingresos y a quién le hablás. Definimos qué vamos a construir y qué resultado buscamos.",
    deliverables: [
      "Plan de trabajo claro",
      "Mapa de contenidos y pantallas",
      "Referencias visuales",
    ],
  },
  {
    number: "02",
    title: "Diseñar & Prototipar",
    duration: "Semana 2",
    description:
      "Diseñamos cómo se ve y cómo se usa cada pantalla. Armamos un prototipo interactivo que podés recorrer antes de construir nada, pensado para computadora y celular.",
    deliverables: [
      "Boceto de cada pantalla",
      "Diseño para computadora y celular",
      "Prototipo interactivo para probar",
    ],
  },
  {
    number: "03",
    title: "Construir & Animar",
    duration: "Semanas 3-4",
    description:
      "Programamos tu sitio para que cargue al instante y no tenga errores. Sumamos animaciones suaves y lo conectamos a tus datos.",
    deliverables: [
      "Programación completa",
      "Animaciones y detalles",
      "Versión de prueba en vivo antes del lanzamiento",
    ],
  },
  {
    number: "04",
    title: "Lanzar & Optimizar",
    duration: "Lanzamiento",
    description:
      "Publicamos tu sitio con la mejor infraestructura disponible, configuramos tu dominio, revisamos que cargue rápido y aparezca bien en Google, y te acompañamos después del lanzamiento.",
    deliverables: [
      "Revisión de velocidad y de Google",
      "Configuración de estadísticas",
      "30 días de garantía y soporte",
    ],
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

export const techStack: TechStackItem[] = [
  {
    name: "Next.js 16 (Turbopack)",
    category: "frontend",
    description: "Server Components, streaming SSR y compilación instantánea.",
    badge: "Full-Stack Framework",
  },
  {
    name: "React 19 & TypeScript",
    category: "frontend",
    description:
      "Tipado estricto, 0 errores en runtime y arquitectura escalable.",
    badge: "Core UI",
  },
  {
    name: "Tailwind CSS v4",
    category: "frontend",
    description: "Motor CSS moderno y ultraligero sin sobrecarga de estilos.",
    badge: "Design Tokens",
  },
  {
    name: "Framer Motion & Lenis",
    category: "frontend",
    description:
      "Animaciones a 60 FPS aceleradas por hardware y scroll inercial suave.",
    badge: "Motion System",
  },
  {
    name: "Supabase (PostgreSQL)",
    category: "backend",
    description:
      "Base de datos relacional con RLS, subscripciones Realtime y Auth.",
    badge: "Database & Auth",
  },
  {
    name: "Vercel Edge Network",
    category: "backend",
    description:
      "Distribución global en el Edge con tiempos de respuesta < 50ms.",
    badge: "Cloud Infra",
  },
  {
    name: "OpenAI & Anthropic LLMs",
    category: "ai",
    description:
      "Integración de inteligencia artificial conversacional y asistentes.",
    badge: "AI Models",
  },
  {
    name: "Pipelines de Datos en Vivo",
    category: "ai",
    description:
      "Integración de datos satelitales (NASA), scrapers y APIs externas.",
    badge: "Data Stream",
  },
  {
    name: "Figma Design Systems",
    category: "design",
    description:
      "Componentes atómicos, guías de estilo y prototipado interactivo.",
    badge: "UI / UX",
  },
  {
    name: "Dirección de Arte & Shaders",
    category: "design",
    description:
      "Tipografía de exhibición, Canvas/WebGL sutil y micro-interacciones.",
    badge: "Creative Tech",
  },
];
