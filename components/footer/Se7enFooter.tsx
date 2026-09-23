"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildSVG, bindScene } from "./scene";
import { SITE } from "@/data/site";

/**
 * Footer cinemático de Se7en Studio — "Construimos el puente".
 * Next.js 14 + Tailwind, sin dependencias. Va al final del layout: <Se7enFooter />
 * Fuentes: usa --font-geist-sans / --font-geist-mono (paquete `geist`) si están definidas.
 */

const EXPLORAR = [
  ["Nuestros Trabajos", "/work"],
  ["Servicios y Precios", "/services"],
  ["Tecnología", "/tech"],
  ["Blog", "/blog"],
  ["Testimonios", "/testimonials"],
  ["Sistema de Diseño", "/design-system"],
  ["Seguridad y Confidencialidad", "/security"],
  ["Sobre el Estudio", "/#about"],
] as const;
const HERRAMIENTAS = [
  ["Portal de Inicio", "/kickoff"],
  ["Diagnóstico Gratuito", "/audit"],
  ["Calculadora de Retorno", "/roi"],
  ["Ejemplo de Sitio en Vivo", "/portal"],
  ["Configurador de Precios", "/pricing"],
  ["Demos Interactivas", "/playground"],
] as const;

const mono =
  "font-mono [font-family:var(--font-geist-mono),ui-monospace,monospace]";
const reveal =
  "opacity-0 motion-reduce:!opacity-100 motion-reduce:!transform-none";

function Clock() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const t = () => setNow(f.format(new Date()));
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);
  return <b className="font-medium text-[#f5f5f4]">{now}</b>;
}

function StatusTag() {
  return (
    <span
      className={`${mono} inline-flex items-center gap-2 rounded-full border border-white/[.08] bg-[#17171a]/70 px-3 py-1.5 text-xs text-[#f5f5f4] md:backdrop-blur`}
    >
      <i className="h-[7px] w-[7px] rounded-full bg-[#ff4d2e] shadow-[0_0_10px_#ff4d2e]" />
      Estudio Abierto <span className="text-[#8a8a8e]">· Patagonia AR</span>
    </span>
  );
}

export default function Se7enFooter() {
  const root = useRef<HTMLElement>(null);
  const svg = useMemo(() => buildSVG(), []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // En mobile el contenedor de la escena es mucho más angosto que alto:
    // con la amplitud de paneo pensada para desktop (14vh), el slice de
    // aspect-ratio del SVG termina mostrando sólo una tira angosta y
    // centrada del puente. Una amplitud menor + contenedor más bajo (ver
    // clases del div [data-art] más abajo) muestra una porción más ancha
    // de la escena a costa de un paneo vertical más sutil.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const ampVh = isMobile ? 5 : 14;
    const apply = bindScene(el, ampVh);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    // En mobile el footer no se pinea (fluye normal): el progreso se mide
    // sobre la altura de la escena, así el puente termina de armarse cuando
    // entra entera y los links de abajo ya están revelados al llegar a ellos.
    const art = el.querySelector<HTMLElement>("[data-art]");
    const span = () => (isMobile && art ? art.offsetHeight : el.offsetHeight);
    const target = () => {
      const r = el.getBoundingClientRect();
      return Math.max(0, Math.min(1, (window.innerHeight - r.top) / span()));
    };
    // El SVG tiene ~900 nodos: re-escribirlo cada frame en reposo es lo que
    // laguea. El rAF corre sólo mientras hay movimiento (scroll/resize) y se
    // apaga solo cuando la inercia llega al target.
    let cur = target(),
      raf = 0;
    const tick = () => {
      const t = target();
      cur += (t - cur) * 0.12; // inercia
      const done = Math.abs(t - cur) < 1e-3;
      if (done) cur = t;
      apply(cur);
      raf = done ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    apply(cur);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", kick, { passive: true });
          window.addEventListener("resize", kick);
          kick();
        } else {
          window.removeEventListener("scroll", kick);
          window.removeEventListener("resize", kick);
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer
      ref={root}
      className="relative bg-[#0a0a0b] text-[#f5f5f4] antialiased md:h-[240vh]"
    >
      <div className="relative overflow-hidden [isolation:isolate] md:sticky md:top-0 md:h-screen">
        {/* escena */}
        <div
          data-art
          className="relative -mt-[5vh] h-[60vh] will-change-transform md:absolute md:inset-x-0 md:mt-0 [&>svg]:absolute [&>svg]:inset-0 [&>svg]:h-full [&>svg]:w-full md:-top-[14vh] md:h-[114vh]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        {/* barra superior */}
        <div className="absolute inset-x-4 top-[18px] z-10 flex items-center justify-between md:inset-x-10 md:top-7">
          <div data-reveal=".62" className={reveal}>
            <StatusTag />
          </div>
          <span
            data-reveal=".64"
            className={`${reveal} ${mono} hidden text-xs tracking-[.06em] text-[#8a8a8e] md:inline`}
          >
            ART (GMT-3) · <Clock />
          </span>
        </div>

        {/* panel de links */}
        <div className="relative z-10 -mt-24 bg-[linear-gradient(to_top,#0a0a0b_88%,rgba(10,10,11,.9)_94%,transparent)] px-4 pb-24 pt-20 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:bg-[linear-gradient(to_top,#0a0a0b_62%,rgba(10,10,11,.85)_80%,transparent)] md:px-10 md:pb-[22px] md:pt-[120px]">
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-6 md:grid-cols-[1.4fr_1fr_1fr_1.1fr] md:gap-10">
            <div
              data-reveal=".86"
              className={`${reveal} col-span-2 md:col-span-1`}
            >
              <h4
                className={`${mono} mb-4 text-[11px] font-medium tracking-[.14em] text-[#8a8a8e]`}
              >
                SE7EN STUDIO
              </h4>
              <p className="hidden max-w-[320px] text-sm leading-relaxed text-[#8a8a8e] md:block">
                Estudio boutique de software y diseño en Argentina. Construimos
                plataformas, tiendas online y sitios web que cargan al instante.
              </p>
              <div className="mt-[18px] grid gap-2 text-sm">
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-[#ff4d2e]"
                >
                  {SITE.email}
                </a>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#ff4d2e]"
                >
                  WhatsApp ↗
                </a>
              </div>
            </div>

            {(
              [
                ["EXPLORAR", EXPLORAR, ".88"],
                ["HERRAMIENTAS", HERRAMIENTAS, ".9"],
              ] as const
            ).map(([title, links, at]) => (
              <nav
                key={title}
                data-reveal={at}
                className={reveal}
                aria-label={title}
              >
                <h4
                  className={`${mono} mb-4 text-[11px] font-medium tracking-[.14em] text-[#8a8a8e]`}
                >
                  {title}
                </h4>
                <ul className="grid gap-2.5 text-sm">
                  {links.map(([label, href]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-[#d6d6d4] transition-colors hover:text-[#ff4d2e]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                  {title === "HERRAMIENTAS" && (
                    <>
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("open-booking-modal"),
                            )
                          }
                          className="text-left text-[#d6d6d4] transition-colors hover:text-[#ff4d2e]"
                        >
                          Agendar una Llamada
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("open-badge-generator"),
                            )
                          }
                          className="text-left text-[#d6d6d4] transition-colors hover:text-[#ff4d2e]"
                        >
                          Insignia &ldquo;Hecho por Se7en&rdquo;
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            ))}

            <div
              data-reveal=".92"
              className={`${reveal} col-span-2 rounded-[18px] border border-white/[.08] bg-[#17171a]/60 p-[22px] md:backdrop-blur-md md:col-span-1`}
            >
              <h4
                className={`${mono} mb-4 text-[11px] font-medium tracking-[.14em] text-[#8a8a8e]`}
              >
                PRÓXIMO PASO
              </h4>
              <strong className="mb-4 block text-[22px] font-semibold leading-[1.15] tracking-[-.02em]">
                Cruzá al otro lado. Tu proyecto, en vivo en 3 semanas.
              </strong>
              <a
                href="/start"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#ff4d2e] px-[22px] py-3.5 text-[15px] font-medium text-white transition hover:brightness-110"
              >
                Iniciar un proyecto →
              </a>
            </div>
          </div>

          <div
            data-reveal=".94"
            className={`${reveal} ${mono} mx-auto mt-[30px] flex max-w-[1360px] flex-col gap-3 border-t md:flex-row md:flex-wrap md:justify-between md:gap-4 border-white/[.08] pt-4 text-xs text-[#8a8a8e]`}
          >
            <span>
              © {new Date().getFullYear()} {SITE.name}. Todos los derechos
              reservados.
            </span>
            <span>
              Tecnología moderna · <span className="text-[#3ddc97]">●</span>{" "}
              Rendimiento 100/100
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="self-start transition-colors hover:text-[#f5f5f4]"
            >
              VOLVER ARRIBA ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
