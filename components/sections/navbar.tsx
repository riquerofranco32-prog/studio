"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight, Search, Volume2, VolumeX } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/data/site";
import { useSoundFx } from "@/components/providers/sound-provider";
import { useActiveSection } from "@/components/ui/side-nav";

const links = [
  { href: "/work", id: "work", label: "Casos" },
  { href: "/services", id: "services", label: "Servicios" },
  { href: "/tech", id: "tech", label: "Ingeniería" },
  { href: "/pricing", id: "pricing", label: "Precios" },
  { href: "/blog", id: "blog", label: "Blog" },
];

export function Navbar() {
  const { soundEnabled, toggleSound } = useSoundFx();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sectionActive = useActiveSection(pathname === "/");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // Progreso de lectura: una línea de acento en el borde de abajo de la
  // pastilla, suavizada con un resorte corto.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.4 });

  // Ruta propia (/work, /blog/x…) o, en la home, la misma sección que marca la
  // side-nav: así los dos indicadores nunca se contradicen.
  const active =
    links.find(
      (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
    )?.id ?? (pathname === "/" ? sectionActive : null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú mobile: foco al primer link, Escape cierra y devuelve el foco al
  // botón, y Tab queda atrapado entre el botón y los links mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const focusables = () =>
      [
        toggleRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
      ].filter((el): el is HTMLElement => el !== null);
    focusables()[1]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      // site-header: le da identidad propia en la capa de View Transitions para
      // poder congelarlo. Ver globals.css — un navbar fijo que se desliza con la
      // página rompe el punto de referencia espacial de la transición.
      //
      // Arriba de todo es una barra transparente a lo ancho. Al bajar se
      // despega del borde y se cierra en una pastilla flotante de vidrio: se
      // angosta, se redondea y baja unos píxeles, todo con la misma curva.
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[var(--ease)] ${
        scrolled ? "px-3 pt-3 md:px-6" : "px-0 pt-0"
      }`}
    >
      <div
        className={`relative mx-auto transition-[max-width,border-radius,background-color,border-color,box-shadow] duration-500 ease-[var(--ease)] ${
          scrolled
            ? `max-w-[1080px] border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 ${
                // Con el menú mobile abierto la pastilla pasa a tarjeta: un
                // radio completo sobre algo alto la deforma en un óvalo.
                open ? "rounded-[28px] bg-background/95" : "rounded-[32px] bg-background/65"
              }`
            : "max-w-[1400px] rounded-none border-0 bg-transparent"
        }`}
      >
        <nav
          className={`flex items-center justify-between transition-[height,padding] duration-500 ease-[var(--ease)] ${
            scrolled ? "h-14 pr-2 pl-5 md:pl-6" : "h-20 px-6 md:px-10"
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
              className={`w-auto transition-[height] duration-500 ease-[var(--ease)] ${scrolled ? "h-6" : "h-7"}`}
            />
          </Link>

          <ul
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    onMouseEnter={() => setHovered(link.id)}
                    className={`focus-ring relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors duration-300 hover:text-foreground ${
                      isActive ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {/* Pastilla que sigue al cursor entre los links. */}
                    {hovered === link.id && (
                      <motion.span
                        layoutId="nav-hover"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-white/[0.09] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="relative h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            {/* Toggle de sonido */}
            <button
              type="button"
              onClick={toggleSound}
              className="focus-ring rounded-full border border-border bg-surface/60 p-2 text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
              title={
                soundEnabled
                  ? "Silenciar efectos de sonido"
                  : "Activar efectos de sonido"
              }
              aria-label={
                soundEnabled
                  ? "Silenciar efectos de sonido"
                  : "Activar efectos de sonido"
              }
            >
              {soundEnabled ? (
                <Volume2 size={15} className="text-accent" />
              ) : (
                <VolumeX size={15} />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-palette"))
              }
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
              title="Buscar (⌘K / Ctrl+K)"
            >
              <Search size={13} />
              <span className={scrolled ? "hidden" : "hidden xl:inline"}>Buscar</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/start"
              className={`focus-ring group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-accent text-sm font-medium text-background shadow-[0_6px_20px_-6px_var(--accent)] transition-[padding,background-color] duration-500 ease-[var(--ease)] hover:bg-accent/90 ${
                scrolled ? "px-4 py-2" : "px-5 py-2.5"
              }`}
            >
              {/* Brillo que cruza el botón al pasar el cursor. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
              />
              <span className="relative">Iniciar un proyecto</span>
              <ArrowUpRight
                size={14}
                className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-palette"))
              }
              className="focus-ring p-2 text-muted hover:text-foreground"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="focus-ring p-2"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Progreso de lectura: sólo en la pastilla. */}
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className={`pointer-events-none absolute right-6 bottom-0 left-6 h-px origin-left bg-gradient-to-r from-accent/0 via-accent to-accent/0 transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
        />

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden lg:hidden ${scrolled ? "" : "border-b border-border bg-background"}`}
          >
            <Container className={`flex flex-col gap-1 py-4 ${scrolled ? "!px-5" : ""}`}>
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
                href="/start"
                onClick={() => setOpen(false)}
                className="focus-ring mt-3 mb-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-3.5 text-base font-medium text-background"
              >
                Iniciar un proyecto <ArrowUpRight size={16} />
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
