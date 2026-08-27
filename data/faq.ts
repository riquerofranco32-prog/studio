export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "process" | "tech" | "pricing" | "support";
}

export const faqs: FAQItem[] = [
  {
    id: "services-scope",
    question: "¿Qué tipo de proyectos y productos digitales construyen?",
    answer:
      "Desarrollamos desde landing pages interactivas y sitios web corporativos de alto impacto visual hasta plataformas SaaS complejas, experiencias de e-commerce personalizadas y soluciones integradas con Inteligencia Artificial. Cada producto se diseña a medida desde cero, sin plantillas genéricas.",
    category: "process",
  },
  {
    id: "timeline",
    question: "¿Cuánto tiempo toma típicamente el desarrollo de un proyecto?",
    answer:
      "Una landing page o sitio institucional suele requerir entre 1 y 2 semanas. Proyectos más complejos como plataformas SaaS, paneles administrativos o tiendas de e-commerce toman entre 2 y 4 semanas, organizadas en sprints con avances continuos en staging.",
    category: "pricing",
  },
  {
    id: "communication",
    question: "¿Cómo es el proceso de trabajo y la comunicación?",
    answer:
      "Trabajás directamente con nosotros (los dos fundadores en ingeniería y diseño), sin intermediarios ni capas burocráticas. Mantenemos comunicación fluida mediante un canal privado de WhatsApp o Slack, con demos en vivo y respuestas en menos de 2 horas hábiles.",
    category: "process",
  },
  {
    id: "international",
    question: "¿Trabajan con clientes internacionales y qué métodos de pago aceptan?",
    answer:
      "Sí, colaboramos activamente con clientes en Argentina, Latinoamérica, Estados Unidos y Europa. Aceptamos transferencias bancarias locales en ARS/USD, transferencias internacionales (SWIFT / ACH), Stripe, Wise y criptoactivos (USDT/USDC).",
    category: "pricing",
  },
  {
    id: "tech-stack",
    question: "¿Qué tecnologías utilizan y qué ventajas ofrece su arquitectura?",
    answer:
      "Nuestra base principal es Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase y despliegue en Vercel Edge. Esta arquitectura garantiza tiempos de carga instantáneos (100/100 Lighthouse), indexación SEO óptima y un código mantenible sin dependencias lentas.",
    category: "tech",
  },
  {
    id: "post-launch",
    question: "¿Ofrecen soporte y garantía luego del lanzamiento?",
    answer:
      "Absolutamente. Todos nuestros proyectos incluyen 30 días de garantía y soporte post-lanzamiento sin costo adicional para asegurar estabilidad total. Además, ofrecemos sprints de evolución continua para escalar tu producto a medida que crecen tus usuarios.",
    category: "support",
  },
];
