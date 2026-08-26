"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { CategoryFilter, CategoryOption } from "@/components/ui/category-filter";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/data/projects";

const categories: CategoryOption[] = [
  { id: "all", label: "Todos", count: projects.length },
  {
    id: "saas",
    label: "SaaS & Plataformas",
    count: projects.filter((p) => p.categoryGroup === "saas").length,
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    count: projects.filter((p) => p.categoryGroup === "ecommerce").length,
  },
  {
    id: "ai",
    label: "IA & Climate",
    count: projects.filter((p) => p.categoryGroup === "ai").length,
  },
  {
    id: "web",
    label: "Web & Marcas",
    count: projects.filter((p) => p.categoryGroup === "web").length,
  },
];

export function SelectedWork() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = projects
    .filter((p) => selectedCategory === "all" || p.categoryGroup === selectedCategory)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="work" className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            kicker="Trabajo seleccionado"
            title="Trabajo seleccionado."
            subtitle={`${projects.length} experiencias digitales que diseñamos y construimos con foco en conversión y estética.`}
          />
          <Magnetic className="shrink-0">
            <ButtonLink href="/#contact" variant="secondary">
              Quiero algo así
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
          </Magnetic>
        </div>

        {/* Barra de filtros interactiva */}
        <div className="mt-12 flex items-center justify-between border-y border-border py-4">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <span className="hidden font-mono text-xs text-muted md:inline">
            Mostrando {filteredProjects.length} de {projects.length}
          </span>
        </div>

        {/* Grilla dinámica de proyectos */}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={i === 0}
                className="w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
                index={i % 2}
              />
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
