import { TeamMember, Testimonial } from "@/types";

// Faltan las fotos (`imageUrl`) y las bios: la tarjeta cae a un placeholder mientras
// estén vacías. Los roles dicen "Fundador" a secas hasta tener el reparto real.
export const team: TeamMember[] = [
  {
    id: "founder-01",
    name: "Franco Riquero",
    role: "Fundador",
    bio: "",
    imageUrl: "",
    linkedin: "https://www.linkedin.com/in/franco-riquero-117492355/",
  },
  {
    id: "founder-02",
    name: "Federico Martín",
    role: "Fundador",
    bio: "",
    imageUrl: "",
    linkedin: "https://www.linkedin.com/in/federico-martin-632223231/",
  },
];

// Vacío hasta tener testimonios reales — la sección se oculta sola cuando está vacío.
export const testimonials: Testimonial[] = [];
