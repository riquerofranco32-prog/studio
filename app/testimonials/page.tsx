import { Metadata } from "next";
import { TestimonialsClient } from "./testimonials-client";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Historias de Clientes, Métricas & Testimonios | Se7en Studio",
  description:
    "Resultados reales de fundadores y empresas que construyeron sus plataformas digitales, SaaS y e-commerce con Se7en Studio.",
  openGraph: {
    title: "Historias de Clientes, Métricas & Testimonios | Se7en Studio",
    description:
      "Resultados reales de fundadores y empresas que construyeron sus plataformas digitales, SaaS y e-commerce con Se7en Studio.",
    url: `${SITE.url}/testimonials`,
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
