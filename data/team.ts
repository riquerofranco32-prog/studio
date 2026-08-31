import { TeamMember, Testimonial } from "@/types";

export const team: TeamMember[] = [
  {
    id: "founder-01",
    name: "Franco Riquero",
    role: "Fundador · Desarrollo & Arquitectura",
    bio: "Desarrollador full-stack e ingeniero de software. Construye cada producto digital del estudio de punta a punta con Next.js 16, TypeScript, Server Actions y Supabase PostgreSQL.",
    imageUrl: "/team/franco-riquero.jpg",
    linkedin: "https://www.linkedin.com/in/franco-riquero-117492355/",
  },
  {
    id: "founder-02",
    name: "Federico Martín",
    role: "Fundador · Dirección de Diseño & UI/UX",
    bio: "Diseñador de producto y sistemas visuales. Traduce identidades de marca en interfaces digitales de altísimo impacto visual, cuidando cada micro-interacción, tipografía y jerarquía estética.",
    imageUrl: "/team/federico-martin.jpg",
    linkedin: "https://www.linkedin.com/in/federico-martin-632223231/",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "test-01",
    name: "Ramiro Gómez",
    role: "Fundador & CEO",
    company: "Takefyy",
    projectSlug: "takefyy",
    highlight: "Velocidad y calidad de producto",
    quote:
      "Se7en diseñó y construyó nuestra plataforma de punta a punta. La velocidad de iteración y la calidad visual superaron cualquier expectativa. Nuestros restaurantes asociados elogian constantemente la simpleza de uso.",
    published: true,
    order: 1,
  },
  {
    id: "test-02",
    name: "Matías Sánchez",
    role: "Co-Founder & Director Creativo",
    company: "Poné La Pava",
    projectSlug: "pone-la-pava",
    highlight: "+120% en tasa de conversión",
    quote:
      "Captaron la identidad de la marca desde el día 1 y la tradujeron en una tienda online rápida, moderna y con altísima tasa de conversión. Trabajar directo con los fundadores sin intermediarios fue un cambio rotundo.",
    published: true,
    order: 2,
  },
  {
    id: "test-03",
    name: "Joaquín Martínez",
    role: "Lead Instructor & Fundador",
    company: "Pravilo Argentina",
    projectSlug: "pravilo",
    highlight: "Identidad cinematográfica",
    quote:
      "Presentar un método nuevo en el país requería un nivel estético y de confianza impecable. La web refleja con exactitud la experiencia física de nuestro centro: cinematográfica, clara y sólida.",
    published: true,
    order: 3,
  },
  {
    id: "test-04",
    name: "Federico A.",
    role: "Tech Lead",
    company: "Sentinel Climate Tech",
    projectSlug: "sentinel",
    highlight: "Visualización en tiempo real",
    quote:
      "Lograron transformar un flujo complejo de datos satelitales en una interfaz intuitiva, con tiempos de respuesta instantáneos y una arquitectura técnica impecable.",
    published: true,
    order: 4,
  },
];
