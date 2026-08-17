import { TeamMember, Testimonial } from "@/types";

// Los retratos son 600x600 aplanados sobre el fondo del sitio — el marco del roster
// es circular, así que se recortan ahí.
export const team: TeamMember[] = [
  {
    id: "founder-01",
    name: "Franco Riquero",
    role: "Fundador · Desarrollo",
    bio: "Desarrollador full-stack. Construye cada producto del estudio de punta a punta — de Takefyy a Sentinel y Pravilo — con Next.js, TypeScript y Supabase.",
    imageUrl: "/team/franco-riquero.jpg",
    linkedin: "https://www.linkedin.com/in/franco-riquero-117492355/",
  },
  {
    id: "founder-02",
    name: "Federico Martín",
    role: "Fundador · Diseño",
    bio: "Diseñador de producto. Traduce identidades de marca en experiencias digitales claras, cuidadas en cada detalle de interacción y jerarquía visual.",
    imageUrl: "/team/federico-martin.jpg",
    linkedin: "https://www.linkedin.com/in/federico-martin-632223231/",
  },
];

// Vacío hasta tener testimonios reales — la sección se oculta sola cuando está vacío.
export const testimonials: Testimonial[] = [];
