import { Project } from "@/types";

// ponytail: local data source for v1 — swap for a Supabase `projects` table read once the schema in supabase/schema.sql is applied.
export const projects: Project[] = [
  {
    slug: "takefyy",
    number: "01",
    name: "Takefyy",
    category: "SaaS / Digital Product",
    year: "2025",
    shortDescription:
      "A digital ordering platform for restaurants — catalogs, orders and admin tools in one product.",
    description:
      "Takefyy is a SaaS product for restaurants to manage digital catalogs and orders. We designed and built the public ordering experience and the admin platform behind it.",
    challenge:
      "Restaurants needed a fast, self-serve way to publish a digital menu and take orders without relying on third-party marketplace fees.",
    approach:
      "We designed a system that separates the public storefront from an admin dashboard, built for owners with no technical background.",
    design:
      "A clean, high-contrast interface that keeps the focus on the product photography and pricing, with a simple cart-to-WhatsApp checkout flow.",
    technology: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    outcome:
      "Live product in production use by real restaurants — outcome details to be added as the case study develops.",
    url: "https://takefyy.com/",
    image: "/projects/takefyy.jpg",
    featured: true,
    order: 1,
    size: "large",
  },
  {
    slug: "pone-la-pava",
    number: "02",
    name: "Poné La Pava",
    category: "E-commerce / Brand Experience",
    year: "2026",
    shortDescription:
      "An e-commerce brand experience built around a distinct visual identity and product catalog.",
    description:
      "Poné La Pava is an e-commerce brand experience — we designed and built the storefront, product catalog and checkout flow.",
    challenge:
      "Translate a strong brand identity into a fast, conversion-focused online store.",
    approach:
      "We built a component-driven storefront with real-time stock management tied directly to product availability.",
    design:
      "Motion-led product reveals and an editorial layout that treats the catalog as the hero of the experience.",
    technology: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    outcome:
      "Live store — outcome details to be added as the case study develops.",
    url: "https://ponelapava.vercel.app/",
    image: "/projects/pone-la-pava.jpg",
    featured: true,
    order: 2,
    size: "medium",
  },
  {
    slug: "sentinel",
    number: "03",
    name: "Sentinel",
    category: "Climate Tech / AI",
    year: "2025",
    shortDescription:
      "A climate technology platform combining satellite fire data with AI-driven risk analysis.",
    description:
      "Sentinel is a climate tech and AI product for environmental monitoring — we designed and built the marketing site and data-driven interactive map.",
    challenge:
      "Present complex environmental and satellite data in a way that is fast, credible and easy to understand.",
    approach:
      "We built an interactive map layer on top of live data sources, paired with a precise, technical brand language.",
    design:
      "A dark, data-first interface where typography and live visualizations carry the credibility of the product.",
    technology: ["Next.js", "TypeScript", "AI/APIs", "Vercel"],
    outcome:
      "Live platform — outcome details to be added as the case study develops.",
    url: "https://sentineltech.com.ar/",
    image: "/projects/sentinel.jpg",
    featured: true,
    order: 3,
    size: "large",
  },
  {
    slug: "apex-ai",
    number: "04",
    name: "Apex AI",
    category: "Artificial Intelligence",
    year: "2025",
    shortDescription:
      "A technology and artificial intelligence product website.",
    description:
      "Apex AI is an artificial intelligence technology product — we designed and built its web presence.",
    challenge:
      "Communicate an AI product's value clearly to a technical audience.",
    approach: "Details to be added as the case study develops.",
    design: "Details to be added as the case study develops.",
    technology: ["Next.js", "AI/APIs"],
    outcome:
      "Live site — outcome details to be added as the case study develops.",
    url: "https://apex-ai-arg.netlify.app/",
    image: "/projects/apex-ai.jpg",
    featured: false,
    order: 4,
    size: "small",
  },
  {
    slug: "altum-sci",
    number: "05",
    name: "Altum Sci",
    category: "Science / Corporate Website",
    year: "2025",
    shortDescription:
      "A corporate website for a scientific and financial advisory firm.",
    description:
      "Altum Sci is a science and corporate advisory brand — we designed and built its corporate website.",
    challenge:
      "Build credibility and clarity for a technical, advisory-driven audience.",
    approach: "Details to be added as the case study develops.",
    design:
      "A restrained, corporate visual language focused on legibility and trust.",
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "Live site — outcome details to be added as the case study develops.",
    url: "https://altumsci.com.ar/",
    image: "/projects/altum-sci.jpg",
    featured: false,
    order: 5,
    size: "medium",
  },
  {
    slug: "pravilo",
    number: "06",
    name: "Pravilo",
    category: "Professional Services",
    year: "2026",
    shortDescription:
      "A corporate website for a professional services practice.",
    description:
      "Pravilo is a professional services brand — we designed and built its corporate website, from copy structure to visual identity.",
    challenge:
      "Present a professional practice with a premium, trustworthy digital presence.",
    approach: "Details to be added as the case study develops.",
    design: "A cinematic, dark-toned identity with real photography and video.",
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "Live site — outcome details to be added as the case study develops.",
    url: "https://www.pravilo.com.ar/",
    image: "/projects/pravilo.jpg",
    featured: false,
    order: 6,
    size: "small",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
