export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  content: {
    heading: string;
    paragraphs: string[];
    codeSnippet?: string;
  }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "de-4-8s-a-0-4s-por-que-nextjs-16-supera-a-wordpress",
    title: "De 4.8s a 0.4s: Por qué Next.js 16 y Server Components superan a cualquier plantilla tradicional",
    excerpt:
      "Analizamos la anatomía técnica del rendimiento web: por qué los constructores monolíticos pierden el 40% de sus conversiones y cómo el Edge Rendering cambia las reglas del juego.",
    publishedAt: "Agosto 2026",
    readTime: "4 min de lectura",
    category: "Ingeniería & Rendimiento",
    author: {
      name: "Franco Riquero",
      role: "Tech Lead en Se7en Studio",
    },
    tags: ["Next.js 16", "Core Web Vitals", "Turbopack", "SEO"],
    content: [
      {
        heading: "El problema oculto de las plantillas tradicionales",
        paragraphs: [
          "Cuando una empresa instala una plantilla de WordPress, WooCommerce o un constructor como Elementor, no solo instala diseño: instala entre 30 y 50 plugins de terceros, hojas de estilo CSS infladas de más de 800 KB y scripts de seguimiento que bloquean el hilo principal del navegador.",
          "El resultado medido en Google PageSpeed es casi siempre el mismo: tiempos de carga móvil superiores a 4.5 segundos, First Contentful Paint (FCP) tardío y un Cumulative Layout Shift (CLS) que desordena la pantalla mientras carga.",
        ],
      },
      {
        heading: "La solución: Server Components y streaming en el Edge",
        paragraphs: [
          "Con Next.js 16 y React 19, el navegador del usuario no recibe JavaScript pesado para interpretar. En su lugar, el servidor en el Edge de Vercel compila el HTML instantáneamente y lo transmite en streaming en menos de 400 milisegundos.",
        ],
        codeSnippet: `// app/page.tsx (Next.js 16 Server Component)
export default async function ProductPage() {
  // ⚡ Consulta directa en el Edge sin exponer API pública
  const data = await getCachedProducts()

  return (
    <main>
      <Hero product={data.featured} />
      <ProductCatalog items={data.catalog} />
    </main>
  )
}`,
      },
      {
        heading: "El impacto directo en el negocio y la facturación",
        paragraphs: [
          "Cada segundo de demora en la carga de una web móvil reduce las conversiones en un 7%. Al pasar de 4.8 segundos a 0.4 segundos, la tasa de rebote cae a menos de la mitad y Google premia el sitio con mejores posiciones orgánicas en los resultados de búsqueda.",
        ],
      },
    ],
  },
  {
    slug: "arquitectura-sin-comisiones-como-construimos-takefyy",
    title: "Arquitectura sin comisiones: Cómo construimos Takefyy con Supabase Realtime",
    excerpt:
      "El caso de estudio técnico detrás de una plataforma SaaS de pedidos que ahorra miles de dólares mensuales a locales gastronómicos.",
    publishedAt: "Agosto 2026",
    readTime: "5 min de lectura",
    category: "Arquitectura SaaS",
    author: {
      name: "Franco Riquero",
      role: "Tech Lead en Se7en Studio",
    },
    tags: ["SaaS", "Supabase", "PostgreSQL", "Realtime"],
    content: [
      {
        heading: "El desafío: Reemplazar el 25% de comisión de los marketplaces",
        paragraphs: [
          "Los restaurantes y locales comerciales pierden entre el 15% y el 25% de cada venta en comisiones a aplicaciones de delivery tradicionales. El objetivo de Takefyy fue darles una plataforma propia ultrarrápida donde el pedido viaja directo a su WhatsApp o sistema interno sin intermediarios.",
        ],
      },
      {
        heading: "Base de datos reactiva con Supabase Postgres y RLS",
        paragraphs: [
          "Para manejar pedidos concurrentes y cambios de stock en vivo, implementamos PostgreSQL con Row-Level Security (RLS) en Supabase. Cada local tiene su propio espacio de datos aislado, y las actualizaciones se transmiten por WebSockets en menos de 20 milisegundos.",
        ],
        codeSnippet: `// Sincronización en tiempo real de pedidos
const channel = supabase
  .channel('live-orders')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'orders',
    filter: \`store_id=eq.\${storeId}\`
  }, (payload) => {
    playNotificationSound()
    updateOrderFeed(payload.new)
  })
  .subscribe()`,
      },
      {
        heading: "Resultados en producción",
        paragraphs: [
          "La plataforma opera en producción con decenas de miles de pedidos mensuales procesados, 99.99% de disponibilidad y una latencia media de carga de catálogo inferior a 0.5 segundos.",
        ],
      },
    ],
  },
  {
    slug: "guia-definitiva-core-web-vitals-100-para-fundadores",
    title: "Core Web Vitals 100/100: La guía definitiva de optimización para fundadores",
    excerpt:
      "Qué significan métricas como LCP, CLS e INP y por qué son el indicador más importante de salud digital para tu startup.",
    publishedAt: "Agosto 2026",
    readTime: "3 min de lectura",
    category: "Estrategia & Craft",
    author: {
      name: "Federico",
      role: "Design Lead en Se7en Studio",
    },
    tags: ["Design Systems", "UX", "Web Vitals", "Lighthouse"],
    content: [
      {
        heading: "Las 3 métricas que Google mide en tu sitio",
        paragraphs: [
          "Google evalúa la experiencia de usuario a través de tres pilares fundamentales: Largest Contentful Paint (cuánto tarda en verse el contenido principal), Cumulative Layout Shift (si los elementos saltan o se mueven mientras carga) e Interaction to Next Paint (cuán rápido reacciona la web a los clics del usuario).",
        ],
      },
      {
        heading: "Diseño con intención: Por qué el diseño y la velocidad son inseparables",
        paragraphs: [
          "Un buen diseño no es solo cómo se ve; es cómo se siente. Si una animación hermosa traba el scroll en un teléfono móvil, el diseño ha fallado. En Se7en Studio diseñamos interfaces atómicas en Figma optimizadas para renderizarse con aceleración por GPU.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
