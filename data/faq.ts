export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqs: FAQItem[] = [
  {
    id: "services-scope",
    question: "¿Qué tipo de proyectos y productos digitales construyen?",
    answer:
      "Desarrollamos desde landing pages interactivas y sitios web corporativos de alto impacto visual hasta plataformas SaaS complejas, experiencias de e-commerce personalizadas y soluciones integradas con Inteligencia Artificial. Cada producto se diseña a medida desde cero, sin plantillas genéricas.",
  },
  {
    id: "timeline",
    question: "¿Cuánto tiempo toma típicamente el desarrollo de un proyecto?",
    answer:
      "Una landing page o sitio institucional suele requerir entre 2 y 3 semanas. Proyectos más complejos como plataformas SaaS, paneles administrativos o tiendas de e-commerce personalizadas toman entre 4 y 8 semanas, organizadas en sprints con avances semanales tangibles.",
  },
  {
    id: "communication",
    question: "¿Cómo es el proceso de trabajo y la comunicación?",
    answer:
      "Trabajás directamente con nosotros (Franco en desarrollo y Federico en diseño), sin ejecutivos de cuentas ni capas burocráticas. Mantenemos comunicación fluida mediante un canal privado de WhatsApp o Slack, reuniones de sincronización semanales y accesos en vivo al entorno de desarrollo (staging).",
  },
  {
    id: "international",
    question: "¿Trabajan con clientes de otros países y qué monedas aceptan?",
    answer:
      "Sí, colaboramos activamente con clientes en Argentina, Latinoamérica, Estados Unidos y Europa. Aceptamos transferencias bancarias locales en ARS, transferencias internacionales en USD/EUR y pagos mediante plataformas seguras como Stripe, Wise o criptoactivos.",
  },
  {
    id: "tech-stack",
    question: "¿Qué tecnologías utilizan y qué ventajas ofrece su arquitectura?",
    answer:
      "Nuestra base principal es Next.js, React, TypeScript, Tailwind CSS, Supabase y despliegue global en Vercel. Esta arquitectura garantiza máxima velocidad de carga (Core Web Vitals óptimos), excelente indexación en motores de búsqueda (SEO), seguridad robusta y una experiencia de usuario extremadamente fluida sin lag.",
  },
  {
    id: "post-launch",
    question: "¿Ofrecen soporte y mantenimiento luego de que el sitio esté publicado?",
    answer:
      "Absolutamente. Todos los lanzamientos incluyen 30 días de garantía y soporte técnico posterior para asegurar estabilidad total. Además, ofrecemos planes de evolución continua y acompañamiento mensual para iterar nuevas funcionalidades a medida que tu negocio crece.",
  },
];
