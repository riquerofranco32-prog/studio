export type RadarRing = "adopt" | "trial" | "assess" | "avoid";
export type RadarCategory = "frontend" | "backend" | "ai" | "infrastructure" | "design";

export interface RadarItem {
  id: string;
  name: string;
  ring: RadarRing;
  category: RadarCategory;
  description: string;
  why: string;
  benchmark?: string;
}

export const radarItems: RadarItem[] = [
  // ADOPT (Core de Ingeniería)
  {
    id: "nextjs-16",
    name: "Next.js 16 (Turbopack)",
    ring: "adopt",
    category: "frontend",
    description: "Framework Full-Stack estándar con Server Components y compilación instantánea.",
    why: "Permite streaming SSR, optimización automática de assets y cero código de servidor expuesto en el cliente.",
    benchmark: "Lighthouse 100/100",
  },
  {
    id: "react-19",
    name: "React 19 Server Actions",
    ring: "adopt",
    category: "frontend",
    description: "Mutaciones atómicas seguras en el servidor sin necesidad de crear endpoints REST manuales.",
    why: "Reduce el código boilerplate en un 60% y previene fugas de memoria y secrets.",
    benchmark: "0 Endpoints REST expuestos",
  },
  {
    id: "tailwind-v4",
    name: "Tailwind CSS v4",
    ring: "adopt",
    category: "design",
    description: "Motor CSS moderno con variables CSS nativas y rendimiento de compilación ultrarrápido.",
    why: "Genera archivos CSS de menos de 15KB en producción con soporte total de design tokens.",
    benchmark: "< 15 KB CSS bundle",
  },
  {
    id: "supabase-postgres",
    name: "Supabase (PostgreSQL & RLS)",
    ring: "adopt",
    category: "backend",
    description: "Base de datos relacional con Row-Level Security, Auth integrado y suscripciones Realtime.",
    why: "Garantiza seguridad a nivel de base de datos sin depender de capas de abstracción lentas.",
    benchmark: "< 25ms query latency",
  },
  {
    id: "framer-motion",
    name: "Framer Motion & Lenis",
    ring: "adopt",
    category: "frontend",
    description: "Sistema de animación y física de resortes acelerado por hardware a 60 FPS.",
    why: "Micro-interacciones cinemáticas con scroll inercial suave y respeto a reduced-motion.",
    benchmark: "60 FPS sostenidos",
  },
  {
    id: "vercel-edge",
    name: "Vercel Edge Network",
    ring: "adopt",
    category: "infrastructure",
    description: "Infraestructura global serverless con CDN perimetral en más de 300 ciudades.",
    why: "Respuesta inmediata para usuarios en Latinoamérica, Norteamérica y Europa.",
    benchmark: "< 40ms TTFB global",
  },

  // TRIAL (En producción activa)
  {
    id: "claude-3-7",
    name: "Claude 3.7 & OpenAI LLMs",
    ring: "trial",
    category: "ai",
    description: "Integración de agentes inteligentes y modelos de razonamiento híbrido.",
    why: "Automatización de atención al cliente, generación de contenidos y análisis de datos en tiempo real.",
    benchmark: "Respuestas contextuales en streaming",
  },
  {
    id: "pgvector",
    name: "pgvector (Búsqueda Semántica)",
    ring: "trial",
    category: "backend",
    description: "Embeddings vectoriales almacenados directamente dentro de PostgreSQL.",
    why: "Permite búsqueda semántica por similitud sin agregar bases de datos vectoriales separadas como Pinecone.",
    benchmark: "Búsqueda RAG en < 50ms",
  },

  // ASSESS (En evaluación / I+D)
  {
    id: "webgpu",
    name: "WebGPU & Three.js Shaders",
    ring: "assess",
    category: "frontend",
    description: "Renderizado 3D de alta fidelidad directamente en el navegador.",
    why: "Para experiencias de marca interactivas y visualizadores de producto tridimensionales.",
    benchmark: "Shaders en GPU nativa",
  },
  {
    id: "biometrics-webauthn",
    name: "WebAuthn / Passkeys",
    ring: "assess",
    category: "backend",
    description: "Autenticación biométrica con FaceID y TouchID sin contraseñas.",
    why: "0 fricción en el inicio de sesión y máxima seguridad contra phishing.",
    benchmark: "Login en 1 segundo",
  },

  // AVOID (Tecnologías obsoletas / No recomendadas)
  {
    id: "wordpress-bloat",
    name: "WordPress / Constructores Lentos (Elementor, Divi)",
    ring: "avoid",
    category: "frontend",
    description: "Constructores visuales inflados con código basura y bases de datos monolíticas.",
    why: "Tiempos de carga superiores a 4 segundos, mala puntuación SEO en móviles y dependencia de servidores caros.",
    benchmark: "Penalización en Core Web Vitals",
  },
  {
    id: "third-party-plugins",
    name: "40+ Plugins de Terceros sin Tipar",
    ring: "avoid",
    category: "backend",
    description: "Dependencia de extensiones no mantenidas de repositorios públicos.",
    why: "Fuente número 1 de brechas de seguridad, caídas inesperadas y conflictos de código.",
    benchmark: "Vulnerabilidades recurrentes",
  },
  {
    id: "jquery-legacy",
    name: "Librerías Legacy (jQuery, Bootstrap antiguo)",
    ring: "avoid",
    category: "frontend",
    description: "Manipulación manual del DOM con scripts pesados no modulares.",
    why: "Incompatible con SSR moderno y bloquea el hilo principal del navegador.",
    benchmark: "Bloqueo de CPU",
  },
];
