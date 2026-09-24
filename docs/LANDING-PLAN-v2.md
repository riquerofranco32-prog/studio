# Plan de mejora v2 — 2026-09-23

Auditoría de https://se7enstudio.vercel.app/ en desktop. Se mantiene la identidad
(oscuro, acento `#ff4d2e`, Geist). Regla: no se inventan métricas, clientes ni testimonios.

## Diagnóstico

| # | Problema | Dónde |
|---|---|---|
| 1 | Hueco vertical enorme entre el H1 y el subtítulo del hero; la tarjeta "terminal" flota desconectada y su copy es flojo ("Se ve perfecto en tu computadora") | `hero.tsx` |
| 2 | La marquesina de marcas aparece dos veces (ticker del hero y Proof) | `hero.tsx`, `proof.tsx` |
| 3 | Métricas de Proof débiles ("2 fundadores directos", "100% velocidad & SEO") | `proof.tsx` |
| 4 | Demasiados elementos flotantes: side-nav, status bar, WhatsApp, cursor. La status bar tapa el copyright del footer | `layout.tsx`, `floating-status-bar.tsx`, `whatsapp-widget.tsx` |
| 5 | La side-nav queda con la sección activa trabada ("Servicios" en FAQ/footer, "Inicio" en Trabajo) | `side-nav.tsx` |
| 6 | "N cupos abiertos" y el mes están hardcodeados/duplicados en 4 componentes | `contact.tsx`, `floating-status-bar.tsx`, `cta-banner.tsx`, `availability-banner.tsx` |
| 7 | Secciones medias correctas pero planas: jerarquía, ritmo vertical, hover states, CTA por servicio | `selected-work`, `services`, `process`, `about` |
| 8 | FAQ/Contacto: validación, estados, a11y del formulario | `faq.tsx`, `contact.tsx` |
| 9 | SEO: JSON-LD mínimo, sin FAQPage schema | `layout.tsx`, `faq.tsx` |

## Ejecución (agentes en paralelo, archivos disjuntos)

- **A — Hero + Proof**: #1, #2, #3.
- **B — Chrome global**: #4, #5, #6 (fuente única en `data/site.ts`), #9 (JSON-LD org).
- **C — Secciones medias**: #7.
- **D — Conversión**: #8, FAQPage schema.

Después: build + lint + visual-check a 4 breakpoints, code review, push.
