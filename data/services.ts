import { ProcessStep, Service } from "@/types";

export const services: Service[] = [
  {
    number: "01",
    title: "Experiencias Digitales",
    description:
      "Landing pages, sitios corporativos y experiencias de marca inmersivas.",
  },
  {
    number: "02",
    title: "E-Commerce",
    description:
      "Catálogos, sistemas de pedidos, experiencias de compra y sitios enfocados en conversión.",
  },
  {
    number: "03",
    title: "Productos Digitales",
    description:
      "SaaS, dashboards, paneles de administración y plataformas a medida.",
  },
  {
    number: "04",
    title: "IA y Tecnología",
    description:
      "Integraciones de IA, automatizaciones, APIs y soluciones digitales a medida.",
  },
];

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Descubrir",
    description: "Entender el negocio, la audiencia y el objetivo.",
  },
  {
    number: "02",
    title: "Diseñar",
    description: "Definir la dirección visual y la experiencia de usuario.",
  },
  {
    number: "03",
    title: "Construir",
    description:
      "Convertir el concepto en un producto digital rápido y escalable.",
  },
  {
    number: "04",
    title: "Lanzar",
    description: "Publicar, optimizar e iterar.",
  },
];

export const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "Vercel",
  "IA",
  "APIs",
];
