"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Search, Volume2, VolumeX } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/data/site";
import { useSoundFx } from "@/components/providers/sound-provider";

const links = [
  { href: "/work", id: "work", label: "Portafolio" },
  { href: "/services", id: "services", label: "Servicios" },
  { href: "/#estimator", id: "estimator", label: "Cotizador" },
  { href: "/#about", id: "about", label: "Nosotros" },
  { href: "/#faq", id: "faq", label: "Preguntas" },
];

export function Navbar() {
  const { soundEnabled, toggleSound } = useSoundFx();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname === "/work") {
      setActive("work");
      return;
    }
    if (pathname === "/services") {
      setActive("services");
      return;
    }

    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const sections = links
      .filter((link) => link.href.startsWith("/#"))
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          } else {
            setActive((cur) => (cur === entry.target.id ? null : cur));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      // site-header: le da identidad propia en la capa de View Transitions para
      // poder congelarlo. Ver globals.css — un navbar fijo que se desliza con la
      // página rompe el punto de referencia espacial de la transición.
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <nav
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <Link href="/" className="focus-ring inline-flex items-center">
            {/* El PNG viene recortado a su caja de contenido, así que el alto
                fijo alcanza para alinearlo ópticamente sin ajustes. El alt lleva
                el nombre porque acá el logo ES el texto: sin él, el link al home
                no tendría nombre accesible. */}
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={800}
              height={224}
              // Sin `sizes` Next asume que la imagen puede ocupar todo el ancho y
              // sirve la variante de 1920px para un logo que se pinta a ~115px.
              sizes="120px"
              priority
              className="h-7 w-auto"
            />
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`focus-ring relative text-sm transition-colors hover:text-foreground ${
                    active === link.id ? "text-foreground" : "text-muted"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      active === link.id ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            {/* Toggle de sonido */}
            <button
              type="button"
              onClick={toggleSound}
              className="focus-ring p-2 rounded-full border border-border bg-surface/80 text-muted hover:border-foreground/30 hover:text-foreground transition-colors"
              title={soundEnabled ? "Silenciar efectos de sonido" : "Activar efectos de sonido"}
              aria-label={soundEnabled ? "Silenciar efectos de sonido" : "Activar efectos de sonido"}
            >
              {soundEnabled ? (
                <Volume2 size={15} className="text-accent" />
              ) : (
                <VolumeX size={15} />
              )}
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 font-mono text-xs text-muted hover:border-foreground/30 hover:text-foreground transition-colors"
              title="Buscar (⌘K / Ctrl+K)"
            >
              <Search size={13} />
              <span className="hidden xl:inline">Buscar</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/start"
              className="focus-ring group inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors duration-300 hover:bg-accent/90 shadow-[0_0_20px_rgba(255,77,46,0.25)]"
            >
              Iniciar un proyecto
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="focus-ring p-2 text-muted hover:text-foreground"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="focus-ring p-2"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring py-3 text-lg text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="focus-ring mt-3 mb-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-3.5 text-base font-medium text-background"
              >
                Iniciar un proyecto <ArrowUpRight size={16} />
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
