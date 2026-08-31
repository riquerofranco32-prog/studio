import { Project } from "@/types";

// ponytail: fuente de datos local para v1 — reemplazar por lectura de la tabla `projects` de Supabase cuando se aplique supabase/schema.sql.
export const projects: Project[] = [
  {
    slug: "takefyy",
    number: "01",
    name: "Takefyy",
    category: "SaaS / Producto Digital",
    categoryGroup: "saas",
    year: "2025",
    shortDescription:
      "Una plataforma de pedidos digital para restaurantes — catálogos, pedidos y herramientas de administración en un solo producto.",
    description:
      "Takefyy es un producto SaaS para que restaurantes gestionen catálogos digitales y pedidos. Diseñamos y construimos la experiencia pública de pedidos y la plataforma de administración detrás de ella.",
    impactMetric: "Pedidos en tiempo real",
    challenge:
      "Los restaurantes necesitaban una forma rápida y autogestionable de publicar un menú digital y recibir pedidos sin depender de comisiones de marketplaces externos.",
    approach:
      "Diseñamos un sistema que separa el local público de un panel de administración, pensado para dueños sin conocimientos técnicos.",
    design:
      "Una interfaz limpia y de alto contraste que mantiene el foco en la fotografía del producto y los precios, con un flujo simple de carrito a WhatsApp.",
    technology: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    outcome:
      "En uso por restaurantes reales, gestionando catálogos y pedidos digitales día a día.",
    url: "https://takefyy.com/",
    image: "/projects/takefyy.jpg",
    featured: true,
    order: 1,
    size: "large",
  },
  {
    slug: "pone-la-pava",
    number: "02",
    name: "Poné La Pava",
    category: "E-commerce / Experiencia de Marca",
    categoryGroup: "ecommerce",
    year: "2026",
    shortDescription:
      "Una experiencia de marca de e-commerce construida alrededor de una identidad visual distintiva y un catálogo de productos.",
    description:
      "Poné La Pava es una experiencia de marca de e-commerce — diseñamos y construimos el local, el catálogo de productos y el flujo de checkout.",
    impactMetric: "+120% conversión",
    challenge:
      "Traducir una identidad de marca fuerte en una tienda online rápida y enfocada en la conversión.",
    approach:
      "Construimos un local basado en componentes con gestión de stock en tiempo real, ligada directamente a la disponibilidad de cada producto.",
    design:
      "Revelados de producto guiados por motion y un layout editorial que trata al catálogo como el protagonista de la experiencia.",
    technology: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    outcome:
      "Tienda en producción, con stock y catálogo actualizados en tiempo real.",
    url: "https://ponelapavayerbas.com/",
    image: "/projects/pone-la-pava.jpg",
    video: {
      mp4: "/projects/videos/pone-la-pava.mp4",
      webm: "/projects/videos/pone-la-pava.webm",
    },
    featured: true,
    order: 2,
    size: "medium",
  },
  {
    slug: "sentinel",
    number: "03",
    name: "Sentinel",
    category: "Climate Tech & Datos Satelitales",
    categoryGroup: "systems",
    year: "2025",
    shortDescription:
      "Una plataforma de tecnología climática que combina datos satelitales de incendios con análisis de riesgo impulsado por IA.",
    description:
      "Sentinel es un producto de climate tech e IA para monitoreo ambiental — diseñamos y construimos el sitio institucional y el mapa interactivo basado en datos.",
    impactMetric: "NASA FIRMS Satelital",
    challenge:
      "Presentar datos ambientales y satelitales complejos de forma rápida, creíble y fácil de entender.",
    approach:
      "Construimos una capa de mapa interactivo sobre fuentes de datos en vivo, combinada con un lenguaje de marca preciso y técnico.",
    design:
      "Una interfaz oscura y centrada en datos, donde la tipografía y las visualizaciones en vivo sostienen la credibilidad del producto.",
    technology: ["Next.js", "TypeScript", "IA/APIs", "Vercel"],
    outcome:
      "Plataforma en producción con datos satelitales en vivo (NASA FIRMS) e índice de riesgo de incendio.",
    url: "https://sentineltech.com.ar/",
    image: "/projects/sentinel.jpg",
    video: {
      mp4: "/projects/videos/sentinel.mp4",
      webm: "/projects/videos/sentinel.webm",
    },
    featured: true,
    order: 3,
    size: "large",
  },
  {
    slug: "apex-ai",
    number: "04",
    name: "Apex Performance",
    category: "Software & Performance",
    categoryGroup: "systems",
    year: "2025",
    shortDescription:
      "Un sitio web enfocado en alto rendimiento, tecnología y conversión.",
    description:
      "Apex Performance es una plataforma de tecnología y alto rendimiento — diseñamos y construimos su presencia web.",
    impactMetric: "0 fricción técnica",
    challenge:
      "Comunicar con claridad el valor de un producto de tecnología a una audiencia exigente.",
    approach:
      "Construimos un sitio enfocado en comunicar la propuesta de valor con claridad técnica, sin la fricción de una demo o un llamado de ventas previo.",
    design:
      "Una interfaz oscura y minimalista, con la jerarquía tipográfica por delante de cualquier elemento decorativo.",
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "Sitio en producción, presentando el producto con tiempos de carga instantáneos.",
    url: "https://apexperformance.com.ar/",
    image: "/projects/apex-ai.jpg",
    featured: false,
    order: 4,
    size: "small",
  },
  {
    slug: "altum-sci",
    number: "05",
    name: "Altum Sci",
    category: "Inmobiliaria / Sitio Corporativo",
    categoryGroup: "web",
    year: "2025",
    shortDescription:
      "Un sitio web corporativo para una inmobiliaria enfocada en Río Negro y la Patagonia.",
    description:
      "Altum Sci es una inmobiliaria en Río Negro y la Patagonia — diseñamos y construimos su sitio web corporativo.",
    impactMetric: "Inversión Patagonia",
    challenge:
      "Construir credibilidad y claridad para compradores e inversores evaluando propiedades a distancia.",
    approach:
      "Construimos un sitio corporativo con foco en propiedades, ubicación y contacto directo, pensado para consultas a distancia.",
    design:
      "Un lenguaje visual corporativo y contenido, enfocado en la legibilidad y la confianza.",
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "Sitio en producción, usado como canal principal de consulta para compradores e inversores en la Patagonia.",
    url: "https://altumsci.com.ar/",
    image: "/projects/altum-sci.jpg",
    featured: false,
    order: 5,
    size: "medium",
  },
  {
    slug: "pravilo",
    number: "06",
    name: "Pravilo",
    category: "Entrenamiento y Movilidad",
    categoryGroup: "web",
    year: "2026",
    shortDescription:
      "Un sitio web para el primer centro Pravilo de Argentina, un método de entrenamiento y terapia de movilidad.",
    description:
      "Pravilo es un centro de entrenamiento y terapia de movilidad con el método Pravilo (tradición eslava) en Plottier, Neuquén — diseñamos y construimos su sitio web, desde la estructura de contenidos hasta la identidad visual.",
    impactMetric: "1º Centro en Argentina",
    challenge:
      "Presentar un método de entrenamiento poco conocido en Argentina con una presencia digital premium y confiable.",
    approach:
      "Trabajamos junto al instructor para traducir un método de entrenamiento físico en contenido y estructura digital, sin un sitio de referencia previo en el país.",
    design:
      "Una identidad cinematográfica, en tonos oscuros, con fotografía y video reales.",
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "Sitio en producción para el primer centro Pravilo de Argentina, en Plottier, Neuquén.",
    url: "https://www.pravilo.com.ar/",
    image: "/projects/pravilo.jpg",
    video: {
      mp4: "/projects/videos/pravilo.mp4",
      webm: "/projects/videos/pravilo.webm",
    },
    featured: false,
    order: 6,
    size: "small",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
