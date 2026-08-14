import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { getProjectBySlug, projects } from "@/data/projects";

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

  return {
    title: `${project.name} — ${project.category}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.name} — ${project.category}`,
      description: project.shortDescription,
      images: [project.image],
    },
  };
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

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <Container>
        <Link
          href="/#work"
          className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to work
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
            <Image
              src={project.image}
              alt={`${project.name} preview`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          )}
        </div>

        <div className="mt-4">
          {project.challenge && (
            <Field label="Challenge">{project.challenge}</Field>
          )}
          {project.approach && (
            <Field label="Approach">{project.approach}</Field>
          )}
          {project.design && <Field label="Design">{project.design}</Field>}
          {project.technology && project.technology.length > 0 && (
            <Field label="Technology">
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
          {project.outcome && <Field label="Outcome">{project.outcome}</Field>}
        </div>

        <div className="mt-8 border-t border-border pt-10">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 text-2xl font-medium text-foreground transition-opacity hover:opacity-70"
          >
            Live website <ArrowUpRight size={20} />
          </a>
        </div>
      </Container>
    </article>
  );
}
