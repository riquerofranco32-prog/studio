import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { getProjectBySlug, projects } from "@/data/projects";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} — ${project.category}`;

  return {
    title,
    description: project.shortDescription,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.shortDescription,
      url: `${SITE.url}/work/${project.slug}`,
      images: [project.image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

// getProjectBySlug ya cubre 404 en la página; acá solo se usa para armar
// el link de "siguiente proyecto" en el orden de `data/projects.ts`.
function getNextProject(currentSlug: string) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((p) => p.slug === currentSlug);
  return sorted[(index + 1) % sorted.length];
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border py-8">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        {label}
      </p>
      <div className="mt-4 max-w-2xl text-lg text-foreground/90">
        {children}
      </div>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const nextProject = getNextProject(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.shortDescription,
    url: `${SITE.url}/work/${project.slug}`,
    image: `${SITE.url}${project.image}`,
    creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
    dateCreated: project.year,
  };

  return (
    <PageTransition>
      <article className="pt-32 pb-24 md:pt-40">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Container>
          <Link
            href="/#work"
            transitionTypes={["nav-back"]}
            className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} /> Volver a trabajo
          </Link>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="text-5xl font-medium tracking-tight text-foreground md:text-7xl">
              <RevealText>{project.name}</RevealText>
            </h1>
            <div className="flex gap-6 font-mono text-xs tracking-widest text-muted uppercase">
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-xl text-muted">
            {project.description}
          </p>

          <div className="relative mt-16 aspect-[16/10] w-full overflow-hidden bg-white/[0.03]">
            {project.image && (
              // Mismo `name` que el thumbnail en components/work/project-card.tsx:
              // es lo que empareja las dos imágenes para que React morphee una en
              // la otra en vez de cortar y volver a dibujar.
              <ViewTransition
                name={`project-${project.slug}`}
                share="morph"
                default="none"
              >
                <Image
                  src={project.image}
                  alt={`${project.name} preview`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </ViewTransition>
            )}
          </div>

          <div className="mt-4">
            {project.challenge && (
              <Field label="Desafío">{project.challenge}</Field>
            )}
            {project.approach && (
              <Field label="Enfoque">{project.approach}</Field>
            )}
            {project.design && <Field label="Diseño">{project.design}</Field>}
            {project.technology && project.technology.length > 0 && (
              <Field label="Tecnología">
                <div className="flex flex-wrap gap-3">
                  {project.technology.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Field>
            )}
            {project.outcome && (
              <Field label="Resultado">{project.outcome}</Field>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 text-2xl font-medium text-foreground transition-opacity hover:opacity-70"
            >
              Sitio en vivo <ArrowUpRight size={20} />
            </a>

            <Link
              href={`/work/${nextProject.slug}`}
              transitionTypes={["nav-forward"]}
              className="focus-ring group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Siguiente proyecto — {nextProject.name}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </Container>
      </article>
    </PageTransition>
  );
}
