"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { SITE } from "@/data/site";

// El sitio no tiene backend (Supabase está preparado pero no conectado — ver lib/supabase.ts),
// así que el formulario compone un mail prellenado en vez de fingir un envío que no existe.
function buildMailto(data: {
  name: string;
  email: string;
  company: string;
  idea: string;
}) {
  const subject = `Nuevo proyecto — ${data.name}${
    data.company ? ` (${data.company})` : ""
  }`;
  const body = [
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Empresa: ${data.company}` : null,
    "",
    "Idea:",
    data.idea,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      idea: String(form.get("idea") ?? ""),
    };
    window.location.href = buildMailto(data);
    setSent(true);
  }

  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <Container>
        {/* gap-x en una grilla de 12 columnas se multiplica por 11: a 768px un
            gap de 80px desborda el contenedor. Crece recién en lg. */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-10 lg:gap-x-20">
          <div className="md:col-span-5">
            <p className="mb-6 font-mono text-xs tracking-widest text-muted uppercase">
              Contacto
            </p>
            {/* RevealText recorta con overflow-hidden: el titular tiene que entrar
                en la columna de 5/12 o "Construyámosla." se corta a la derecha. */}
            <h2 className="display text-[2.6rem] text-foreground sm:text-5xl md:text-[3.4rem] lg:text-[4rem]">
              <RevealText>¿Tenés una idea?</RevealText>
              <RevealText index={1}>
                <span className="text-accent">Construyámosla.</span>
              </RevealText>
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              Contanos en qué estás trabajando. Respondemos todos los mensajes —
              normalmente dentro de las 24 horas.
            </p>

            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8">
              <DirectLink
                href={`mailto:${SITE.email}`}
                icon={Mail}
                label={SITE.email}
              />
              <DirectLink
                href={SITE.whatsapp}
                icon={MessageCircle}
                label="WhatsApp"
              />
              {(SITE.social.instagram || SITE.social.linkedin) && (
                <div className="mt-2 flex gap-6">
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
          </div>

          <div className="md:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-6 md:p-10"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  name="name"
                  label="Nombre"
                  placeholder="Cómo te llamás"
                  required
                />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="mt-6">
                <Field name="company" label="Empresa" placeholder="Opcional" />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="idea"
                  className="mb-2 block font-mono text-xs tracking-widest text-muted uppercase"
                >
                  Contanos tu idea
                </label>
                <textarea
                  id="idea"
                  name="idea"
                  rows={5}
                  required
                  placeholder="Qué querés construir, para quién y para cuándo."
                  className="focus-ring w-full resize-none rounded-lg border border-border bg-background px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted/60 hover:border-foreground/25 focus:border-accent"
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-background transition-colors duration-300 hover:bg-accent/90"
                >
                  Enviar mensaje
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                {sent ? (
                  <p aria-live="polite" className="text-sm text-foreground">
                    Abrimos tu cliente de correo con el mensaje listo. Si no se
                    abrió, escribinos a{" "}
                    <a
                      href={`mailto:${SITE.email}`}
                      className="focus-ring text-accent underline underline-offset-4"
                    >
                      {SITE.email}
                    </a>
                    .
                  </p>
                ) : (
                  <p className="text-xs text-muted">
                    Se abre tu cliente de correo con el mensaje ya escrito.
                  </p>
                )}
              </div>
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
