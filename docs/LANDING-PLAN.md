# Plan de mejora de la landing

Referencia de dirección: [paisanos.io/es](https://www.paisanos.io/es) — estudio de
producto/tecnología con una landing que resuelve bien tres cosas que a esta le faltaban:
color de marca con intención, prueba social arriba del scroll, y un cierre de contacto
que no es sólo un `mailto:`.

Estado a 2026-08-14. Fase 1 está implementada y verificada; el resto es backlog priorizado.

---

## Diagnóstico del punto de partida

| Problema | Evidencia |
|---|---|
| Cero color de marca | La paleta era 100% monocroma (`--accent: #f5f5f4`, es decir, el mismo blanco del texto). Nada guiaba la mirada al CTA. |
| Geist no se aplicaba | `next/font` inyectaba `--font-geist-sans` en `<body>`, pero Tailwind resuelve `--font-sans` en `:root`. Todo el sitio renderizaba con el stack del sistema. |
| Sin prueba social | La primera señal de credibilidad aparecía recién en `#about`, a ~4.000px de scroll. |
| CTAs sin jerarquía | Los tres CTAs del hero eran links de texto del mismo peso. |
| Contacto pobre | Un `mailto:` suelto, sin formulario ni fricción baja. |
| Servicios planos | Cuatro celdas de texto sin estado hover ni entregables concretos. |

---

## Fase 1 — Sistema visual y estructura (HECHO)

### Tokens y tipografía
- Acento de marca `#ff4d2e` en `--accent` + `--accent-soft`, y superficies elevadas
  (`--surface`, `--surface-2`) para tarjetas, filas y campos de formulario.
- Clase `.display` (peso 600, `letter-spacing: -0.035em`, `line-height: 0.95`) como
  escala de titulares. H1 desktop pasó de 72px a **104px**.
- **Fix de fuente**: las variables de `next/font` se movieron de `<body>` a `<html>`.
  Verificado por computed style: `font-family: Geist, "Geist Fallback", system-ui`.
- Keyframes `marquee` + componente `<Marquee>` (CSS puro, duplica el track, pausa en hover,
  degradados en los bordes).

### Estructura nueva de la página
```
Hero        → badge de disponibilidad + H1 104px + 2 CTAs + ticker de capacidades
Proof       → NUEVA: marquesina de marcas + 4 métricas derivadas de la data real
Trabajo     → tarjetas con año, overlay "Ver caso de estudio", hover en acento
Servicios   → filas grandes con chips de entregables y filete de acento en hover
Proceso     → estado activo en acento
Nosotros    → métricas movidas a Proof; foco en el statement y el equipo
Tecnología  → sin cambios estructurales
Testimonios → restilado a tarjetas (sigue auto-ocultándose: data/team.ts está vacío)
Contacto    → NUEVA: formulario de 4 campos + canales directos
Footer      → email visible + wordmark gigante de cierre
```

### Componentes nuevos
- `components/ui/button-link.tsx` — pill CTA con variantes `primary` / `secondary` / `ghost`.
- `components/ui/marquee.tsx` — marquesina infinita reutilizable.
- `components/sections/proof.tsx` — marcas + métricas.
- `components/sections/contact.tsx` — reemplaza `final-cta.tsx`.

### Sobre el formulario de contacto
No hay backend conectado (`lib/supabase.ts` está preparado pero sin env vars), así que el
formulario **compone un `mailto:` prellenado** en vez de fingir un envío. Es honesto y
funciona hoy; migrarlo a un endpoint real es el ítem 2.1 de este plan.

### Verificación
Medida con Chrome headless (`puppeteer-core`) a 1440 / 1280 / 768 / 390 px:
- 0 errores de consola.
- 0 overflow horizontal en los 4 breakpoints.
- 0 texto recortado por ancestros `overflow: hidden`.
- Dos bugs encontrados y corregidos en el proceso:
  - `gap-20` sobre `grid-cols-12` desbordaba a 768px (11 gaps × 80px > contenedor).
  - El H1 del hero se recortaba detrás del navbar en mobile por `justify-center`.

---

## Fase 2 — Contenido y credibilidad (lo que más mueve la aguja)

Ordenado por impacto sobre conversión, no por esfuerzo.

### 2.1 Testimonios reales — ALTO impacto
`data/team.ts` exporta un array vacío y la sección se oculta sola. Paisanos apoya toda su
credibilidad en NPS 80 + quotes con nombre y logo. Sin esto, la landing pide confianza sin
darla.
**Acción**: pedir 3 quotes a clientes de Takefyy, Poné La Pava y Pravilo. Cargar en
`testimonials` con `published: true`. La sección aparece sola.

### 2.2 Resultados concretos en los casos — ALTO impacto
Los seis proyectos tienen `outcome: "detalles de resultados a agregar…"`. Un caso sin número
no es un caso.
**Acción**: por proyecto, un dato duro — pedidos procesados, tiempo de carga, ventas,
usuarios. Reemplazar el texto placeholder en `data/projects.ts`.

### 2.3 Nombres y fotos del equipo — ALTO impacto
`team` tiene `name: null` y el bloque muestra "Nombre a definir" con un placeholder gris. En
un estudio de dos personas, las caras SON el diferencial.
**Acción**: nombres, roles, fotos en `public/team/`, links de LinkedIn. Los campos ya están
cableados de punta a punta.

### 2.4 Completar los cuatro casos flojos — MEDIO
Apex AI, Altum Sci y Pravilo tienen `approach` y `design` en placeholder. La página
`/work/[slug]` los muestra igual.

### 2.5 Datos reales del sitio — MEDIO
`data/site.ts` todavía tiene `url: "https://se7enstudio.example.com"` y
`whatsapp: "https://wa.me/5490000000000"`. El `metadataBase` y el sitemap salen de ahí, así
que hoy los OG tags apuntan a un dominio inexistente.

---

## Fase 3 — Experiencia y motion

### 3.1 Imagen OG
No existe `opengraph-image`. Cada vez que alguien comparte el link, sale sin preview.
**Acción**: `app/opengraph-image.tsx` con `ImageResponse` — wordmark + tagline sobre el fondo
oscuro con el acento.

### 3.2 Video o loop en el hero
El recurso más fuerte de paisanos es el video. Un loop mudo de 6-8s mostrando los productos
en uso pesa más que cualquier headline.
**Acción**: `<video>` con `poster`, `muted`, `playsInline`, `preload="metadata"`, respetando
`prefers-reduced-motion`.

### 3.3 Preview en hover en las tarjetas de trabajo
Hoy la tarjeta hace scale + overlay. Paisanos muestra un preview del caso. Alternativa
barata: un segundo screenshot por proyecto que aparezca en hover.

### 3.4 Navbar con sección activa
El header ya reacciona al scroll. Falta resaltar el link de la sección visible
(`IntersectionObserver` sobre los `<section id>`).

### 3.5 Transiciones de página
Next 16 trae View Transitions
(`node_modules/next/dist/docs/.../view-transitions.md`). El salto de la landing a
`/work/[slug]` es hoy un corte seco.

---

## Fase 4 — Producto y performance

### 4.1 Formulario con backend real
Migrar de `mailto:` a un Server Action que inserte en una tabla `leads` de Supabase (el
schema en `supabase/schema.sql` no la tiene todavía) + notificación por mail. Ver
`node_modules/next/dist/docs/.../server-actions.md`.

### 4.2 Índice de trabajo `/work`
Hoy `/#work` es el único listado y los CTAs "ver todo" no tienen dónde ir. Una ruta `/work`
con filtro por categoría abre espacio para más casos sin alargar la home.

### 4.3 Optimización de imágenes
Los screenshots son JPG de 36-151 KB. Convertir a AVIF/WebP y servir dos tamaños vía
`next/image` baja bastante el LCP en mobile.

### 4.4 Presupuesto de performance
Medir con Lighthouse en producción. GSAP + ScrollTrigger + Framer Motion son tres librerías
de animación; probablemente se pueda sacar una.

### 4.5 Accesibilidad
Auditar contraste del acento sobre el fondo (`#ff4d2e` sobre `#0a0a0b`), navegación completa
por teclado en el menú mobile, y `aria-live` en el estado del formulario (ya está puesto,
falta validarlo con lector de pantalla).

---

## Fase 5 — Contenido de largo plazo

Paisanos sostiene la landing con blog, podcast, eventos y newsletter. Para un estudio de dos
personas eso es demasiado, pero **una** de estas piezas alcanza para dar señal de actividad:

- **Notas técnicas** (`/notes`) — 1 por mes, sobre decisiones reales de los proyectos.
- **Changelog público** — qué se lanzó cada mes. Barato de mantener, alta señal.
- **Newsletter** — la de menor esfuerzo si ya hay lista.

Recomendación: changelog. Es el que menos cuesta y el que más muestra que el estudio está vivo.

---

## Orden sugerido

1. **Fase 2 completa** — sin contenido real, ninguna mejora visual convierte.
2. **3.1 (imagen OG) + 2.5 (datos del sitio)** — juntos, media hora, arreglan cómo se ve el
   link compartido.
3. **4.1 (formulario real)** — cerrar el loop de conversión.
4. **3.2 (video en hero)** — el salto de percepción más grande, pero pide producción.
5. Resto por oportunidad.
