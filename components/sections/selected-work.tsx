"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import {
  CategoryFilter,
  CategoryOption,
} from "@/components/ui/category-filter";
import { ProjectGallery } from "@/components/work/project-gallery";
import { projects } from "@/data/projects";
import { SITE } from "@/data/site";

const categories: CategoryOption[] = [
  { id: "all", label: "Todos", count: projects.length },
  {
    id: "saas",
    label: "Plataformas & Apps",
    count: projects.filter((p) => p.categoryGroup === "saas").length,
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    count: projects.filter((p) => p.categoryGroup === "ecommerce").length,
  },
  {
    id: "systems",
    label: "Software & IA",
    count: projects.filter((p) => p.categoryGroup === "systems").length,
  },
  {
    id: "web",
    label: "Web Corporativa",
    count: projects.filter((p) => p.categoryGroup === "web").length,
  },
];

export function SelectedWork() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Memo: la galería vuelve al principio cuando cambia esta lista, así que
  // tiene que mantener la misma referencia entre renders.
  const filteredProjects = useMemo(
    () =>
      projects
        .filter(
          (p) =>
            selectedCategory === "all" || p.categoryGroup === selectedCategory,
        )
        .sort((a, b) => a.order - b.order),
    [selectedCategory],
  );

  return (
    <section id="work" className="border-t border-border py-20 md:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
              <span className="text-accent">●</span> Trabajo
            </p>
            <h2 className="display text-4xl uppercase text-foreground md:text-6xl">
              <RevealText>Trabajo seleccionado</RevealText>
              <RevealText index={1}>
                <span className="text-accent">{SITE.stats.years}</span>
                <span className="align-top text-2xl md:text-3xl">©</span>
              </RevealText>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {projects.length} proyectos que diseñamos y programamos de punta
              a punta, con foco en conversión y en cómo se ven.
            </p>
          </div>
          <Magnetic className="shrink-0">
            <ButtonLink href="/#contact" variant="secondary">
              Iniciar un proyecto
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
          <span
            aria-live="polite"
            className="hidden shrink-0 font-mono text-xs whitespace-nowrap text-muted lg:inline"
          >
            Mostrando {filteredProjects.length} de {projects.length}
          </span>
        </div>

        <div className="mt-12">
          <ProjectGallery projects={filteredProjects} />
        </div>
      </Container>
    </section>
  );
}
