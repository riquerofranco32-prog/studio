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
      "Desarrollamos desde landing pages y sitios web corporativos de alto impacto visual hasta plataformas complejas, tiendas online a medida y soluciones con Inteligencia Artificial. Cada producto se diseña desde cero, sin plantillas genéricas.",
    category: "process",
  },
  {
    id: "timeline",
    question: "¿Cuánto tiempo toma típicamente el desarrollo de un proyecto?",
    answer:
      "Una landing page o sitio institucional suele requerir entre 1 y 2 semanas. Proyectos más complejos, como plataformas, paneles de administración o tiendas online, toman entre 2 y 4 semanas, con avances que podés ir viendo en el camino.",
    category: "pricing",
  },
  {
    id: "communication",
    question: "¿Cómo es el proceso de trabajo y la comunicación?",
    answer:
      "Trabajás directamente con nosotros (los dos fundadores, a cargo del desarrollo y el diseño), sin intermediarios ni capas burocráticas. Mantenemos comunicación fluida por WhatsApp, con demos en vivo y respuestas en menos de 2 horas hábiles.",
    category: "process",
  },
  {
    id: "international",
    question:
      "¿Trabajan con clientes internacionales y qué métodos de pago aceptan?",
    answer:
      "Sí, colaboramos activamente con clientes en Argentina, Latinoamérica, Estados Unidos y Europa. Aceptamos transferencias bancarias locales en ARS/USD, transferencias internacionales (SWIFT / ACH), Stripe, Wise y criptoactivos (USDT/USDC).",
    category: "pricing",
  },
  {
    id: "tech-stack",
    question: "¿Con qué tecnología trabajan y qué ventajas tiene?",
    answer:
      "Usamos las herramientas más modernas y confiables del mercado. Eso se traduce en sitios que cargan al instante, aparecen bien en Google y no dependen de plugins ni de terceros que después dejan de funcionar. El código queda 100% a tu nombre.",
    category: "tech",
  },
  {
    id: "post-launch",
    question: "¿Ofrecen soporte y garantía luego del lanzamiento?",
    answer:
      "Absolutamente. Todos nuestros proyectos incluyen 30 días de garantía y soporte post-lanzamiento sin costo adicional para asegurar estabilidad total. Además, seguimos disponibles para ayudarte a mejorar tu producto a medida que crece.",
    category: "support",
  },
];
