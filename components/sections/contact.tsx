"use client";

import { useState, FormEvent } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealText } from "@/components/ui/reveal-text";
import { CopyButton } from "@/components/ui/copy-button";
import { SITE } from "@/data/site";

const projectTypes = [
  "Landing Page",
  "SaaS / Web App",
  "E-Commerce",
  "Integración IA / API",
  "Rediseño Completo",
];

const budgetRanges = [
  "< $1.500 USD",
  "$1.500 – $3.000 USD",
  "$3.000 – $6.000 USD",
  "$6.000+ USD",
  "A definir",
];

function buildMailto(data: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  idea: string;
}) {
  const subject = `Nuevo proyecto: ${data.projectType} — ${data.name}${
    data.company ? ` (${data.company})` : ""
  }`;
  const body = [
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Empresa: ${data.company}` : null,
    `Tipo de proyecto: ${data.projectType}`,
    `Presupuesto estimado: ${data.budget}`,
    "",
    "Detalle de la idea:",
    data.idea,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const [selectedType, setSelectedType] = useState(projectTypes[0]);
  const [selectedBudget, setSelectedBudget] = useState(budgetRanges[0]);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      projectType: selectedType,
      budget: selectedBudget,
      idea: String(form.get("idea") ?? ""),
    };
    window.location.href = buildMailto(data);
    setSent(true);
  }

  const whatsappPrefilled = `https://wa.me/5492994247985?text=${encodeURIComponent(
    `Hola Se7en Studio! Me gustaría consultarles por un proyecto de ${selectedType}.`,
  )}`;

  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-10 lg:gap-x-20">
          <div className="md:col-span-5">
            <p className="mb-6 font-mono text-xs tracking-widest text-muted uppercase">
              Iniciar Conversación
            </p>

            <h2 className="display text-[2.6rem] text-foreground sm:text-5xl md:text-[3.4rem] lg:text-[4rem]">
              <RevealText>¿Tenés una idea?</RevealText>
              <RevealText index={1}>
                <span className="text-accent">Construyámosla.</span>
              </RevealText>
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              Contanos sobre tu producto u objetivo de negocio. Respondemos cada mensaje de manera personalizada dentro de las 24 horas.
            </p>

            <div className="mt-10 space-y-4 rounded-xl border border-border bg-surface/60 p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-muted">Canal directo:</span>
                <CopyButton text={SITE.email} label="Copiar email" />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`mailto:${SITE.email}`}
                  className="focus-ring inline-flex items-center gap-2.5 text-sm text-foreground transition-colors hover:text-accent"
                >
                  <Mail size={16} className="text-accent" />
                  <span>{SITE.email}</span>
                </a>

                <a
                  href={whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2.5 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp directo (+54 9 299 424-7985)</span>
                </a>
              </div>
            </div>

            {(SITE.social.instagram || SITE.social.linkedin) && (
              <div className="mt-8 flex gap-6">
                {SITE.social.instagram && (
                  <DirectLink
                    href={SITE.social.instagram}
                    icon={InstagramIcon}
                    label="Instagram"
                  />
                )}
                {SITE.social.linkedin && (
                  <DirectLink
                    href={SITE.social.linkedin}
                    icon={LinkedinIcon}
                    label="LinkedIn"
                  />
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-6 md:p-10"
            >
              {/* Selector de Tipo de Proyecto */}
              <div className="mb-6">
                <label className="mb-2.5 block font-mono text-xs tracking-widest text-muted uppercase">
                  1. ¿Qué tipo de proyecto querés construir?
                </label>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`focus-ring rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                        selectedType === type
                          ? "border-accent bg-accent text-background font-medium"
                          : "border-border bg-background text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Presupuesto */}
              <div className="mb-8">
                <label className="mb-2.5 block font-mono text-xs tracking-widest text-muted uppercase">
                  2. Presupuesto estimado
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setSelectedBudget(range)}
                      className={`focus-ring rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                        selectedBudget === range
                          ? "border-accent bg-accent text-background font-medium"
                          : "border-border bg-background text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos de texto */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  name="name"
                  label="Nombre"
                  placeholder="Tu nombre completo"
                  required
                />
                <Field
                  name="email"
                  label="Email de contacto"
                  type="email"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              <div className="mt-6">
                <Field
                  name="company"
                  label="Empresa / Marca"
                  placeholder="Nombre de tu proyecto o empresa (opcional)"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="idea"
                  className="mb-2 block font-mono text-xs tracking-widest text-muted uppercase"
                >
                  Contanos los detalles de tu idea
                </label>
                <textarea
                  id="idea"
                  name="idea"
                  rows={4}
                  required
                  placeholder="Describí brevemente qué querés lograr, funcionalidades principales o fecha estimada de lanzamiento."
                  className="focus-ring w-full resize-none rounded-lg border border-border bg-background px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted/60 hover:border-foreground/25 focus:border-accent"
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <Magnetic>
                  <button
                    type="submit"
                    className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-background transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_0_25px_rgba(255,77,46,0.35)]"
                  >
                    <span>Enviar consulta</span>
                    <Send
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </Magnetic>

                <a
                  href={whatsappPrefilled}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-xs font-mono text-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>O escribir por WhatsApp</span>
                </a>
              </div>

              {sent && (
                <p aria-live="polite" className="mt-4 text-sm text-emerald-400">
                  ¡Listo! Abrimos tu cliente de correo con el mensaje estructurado.
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block font-mono text-xs tracking-widest text-muted uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="focus-ring w-full rounded-lg border border-border bg-background px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted/60 hover:border-foreground/25 focus:border-accent"
      />
    </div>
  );
}

function DirectLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: (props: { size?: number }) => React.ReactNode;
  label: string;
}) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="focus-ring inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-accent"
    >
      <Icon size={16} />
      {label}
    </a>
  );
}
