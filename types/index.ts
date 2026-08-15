export interface Project {
  slug: string;
  number: string;
  name: string;
  category: string;
  year: string;
  shortDescription: string;
  description: string;
  challenge?: string;
  approach?: string;
  design?: string;
  technology?: string[];
  outcome?: string;
  url: string;
  image: string;
  featured: boolean;
  order: number;
  size: "large" | "medium" | "small";
}

export interface Service {
  number: string;
  title: string;
  description: string;
  /** Entregables concretos — se muestran como chips en la fila de servicio. */
  deliverables?: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string | null;
  role: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  published: boolean;
  order: number;
}
