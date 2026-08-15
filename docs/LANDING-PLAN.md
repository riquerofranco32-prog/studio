# Plan de mejora de la landing

Referencia de dirección: [paisanos.io/es](https://www.paisanos.io/es) — estudio de
producto/tecnología con una landing que resuelve bien tres cosas que a esta le faltaban:
color de marca con intención, prueba social arriba del scroll, y un cierre de contacto
que no es sólo un `mailto:`.

Estado a 2026-08-15. Implementados: toda la Fase 1, más 3.1 (imagen OG), 3.4 (navbar con
sección activa), el contraste de 4.5, 4.3 (imágenes) y 4.4 (bundle). El resto es backlog
priorizado, y lo que queda arriba de todo está bloqueado por contenido, no por código.

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

### 2.3 Equipo — HECHO (falta bio)
Franco Riquero (Fundador · Desarrollo) y Federico Martín (Fundador · Diseño), con retratos y
links a LinkedIn.

La sección pasó de dos tarjetas a un **roster en filas**, tomando como referencia el patrón
"Member List" de 21st.dev. El código fuente de esos componentes sigue detrás de un endpoint
con acceso restringido — el mismo muro anotado en `hero.tsx` — así que está construido a
medida con el sistema del sitio: mismo lenguaje que las filas de Servicios, número en mono,
nombre en escala display, filete de acento al hacer hover, y el retrato siguiendo al cursor.

Las fotos venían de LinkedIn en formatos distintos (una PNG 800×800 recortada en círculo con
alfa, una JPG 800×800 a sangre). Se normalizaron a 600×600 aplanadas sobre `#0a0a0b`, el
fondo exacto del sitio, y el marco del roster es circular — así las dos se ven iguales y la
PNG bajó de 698 KB a 37 KB al perder el canal alfa.

**Falta**: las bios (`bio` sigue vacío en `data/team.ts`; el roster todavía no las muestra).

### 2.4 Completar los cuatro casos flojos — MEDIO
Apex AI, Altum Sci y Pravilo tienen `approach` y `design` en placeholder. La página
`/work/[slug]` los muestra igual.

### 2.5 Datos reales del sitio — CASI
Cargados el dominio (`se7enstudio.com.ar`) y el email de contacto. Verificado en el build de
producción: `og:image` y `twitter:image` resuelven a
`https://se7enstudio.com.ar/opengraph-image`, y el sitemap y `robots.txt` listan el dominio
real.

**Falta**: `whatsapp` sigue en `https://wa.me/5490000000000`, un número de relleno. Aparece
en la sección de contacto como canal directo.

---

## Fase 3 — Experiencia y motion

### 3.1 Imagen OG — HECHO
`app/opengraph-image.tsx` y `app/twitter-image.tsx` generan una tarjeta 1200×630 con
`ImageResponse`; el JSX vive en `lib/og-card.tsx` para no duplicarlo. Twitter no hereda
`og:image`, por eso son dos archivos.

Dos límites de Satori que condicionan el diseño: sólo acepta fuentes ttf/otf/woff (Geist
llega como woff2 vía `next/font`, así que la tarjeta se apoya en layout y color, no en la
tipografía de marca), y no soporta filtros — el resplandor del hero se resuelve con un
`linear-gradient`, porque un círculo dejaba un borde duro cruzando el titular.

### 3.2 Video o loop en el hero
El recurso más fuerte de paisanos es el video. Un loop mudo de 6-8s mostrando los productos
en uso pesa más que cualquier headline.
**Acción**: `<video>` con `poster`, `muted`, `playsInline`, `preload="metadata"`, respetando
`prefers-reduced-motion`.

### 3.3 Preview en hover en las tarjetas de trabajo
Hoy la tarjeta hace scale + overlay. Paisanos muestra un preview del caso. Alternativa
barata: un segundo screenshot por proyecto que aparezca en hover.

### 3.4 Navbar con sección activa — HECHO
`IntersectionObserver` con banda `-45% / -50%`, así se activa la sección que cruza el medio
del viewport y no la que apenas asoma por abajo. El link activo pasa a `text-foreground` con
un subrayado en acento y `aria-current="true"`.

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

### 4.3 Optimización de imágenes — HECHO
Dos cambios, los dos medidos:

- **AVIF activado.** El default de Next es `formats: ['image/webp']` a secas. Con AVIF, las
  seis tarjetas pesan **74.7 KB contra 112.4 KB en WebP — 33% menos** a los mismos anchos.
  El navegador cae solo a WebP si no lo soporta.
- **`sizes` por tarjeta.** Todas declaraban `50vw`, pero la grilla las pone a 8, 6 y 4
  columnas. A 1440px eso hacía que las seis pidieran el bucket de 750px: las dos grandes se
  renderizan a 870px (imagen más chica que el hueco, se veía blanda) y las dos chicas a
  422px (bytes de más). Ahora cada tarjeta declara su ancho real y el navegador baja
  1080 / 750 / 640 según corresponde.

Las fuentes son JPG de ~1568×749, tamaño razonable — no hacía falta tocarlas.

### 4.4 Presupuesto de performance — GSAP FUERA
GSAP se usaba en un solo archivo (`hero.tsx`): la timeline de entrada y el paralaje de la
grilla. Framer Motion, en cinco. Se sacó GSAP:

- La secuencia de entrada pasó a keyframes CSS (`.hero-line` / `.hero-rise` en `globals.css`)
  con `animation-delay` por línea. Cero JS y corre fuera del hilo principal.
- El paralaje usa `useScroll` + `useTransform` de Framer Motion, que ya estaba en el bundle.

**847 KB → 744 KB de chunks JS (-103 KB, -12%)**, sin rastro de `ScrollTrigger` en el build.

De paso apareció un bug de accesibilidad: el bloque global de `prefers-reduced-motion`
anulaba `animation-duration` pero no `animation-delay`, así que el contenido del hero habría
quedado invisible 1.4s para quien pide menos movimiento. Agregado `animation-delay: 0s`.

Sigue pendiente medir con Lighthouse contra producción.

### 4.5 Accesibilidad — CONTRASTE HECHO, RESTO PENDIENTE
Ratios medidos contra WCAG:

| Par | Ratio | Estado |
|---|---|---|
| acento sobre fondo | 5.99:1 | AA |
| **blanco sobre acento** | **3.31:1** | **fallaba AA** |
| fondo sobre acento | 5.99:1 | AA |
| muted sobre fondo | 5.75:1 | AA |
| foreground sobre fondo | 18.14:1 | AAA |

Los botones de acento tenían texto blanco a 14px: 3.31:1, por debajo del 4.5:1 que pide AA
para texto normal. Cambiados a `text-background` (texto casi negro sobre el acento), que da
5.99:1. Afecta a `ButtonLink`, los dos CTAs del navbar, el submit del formulario y el badge
de las tarjetas de trabajo.

Pendiente: navegación completa por teclado en el menú mobile, y validar el `aria-live` del
formulario con lector de pantalla.

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

1. **Fase 2 completa** — sin contenido real, ninguna mejora visual convierte. Es lo único
   que hoy bloquea: los campos ya están cableados, falta el contenido.
2. **Fotos del equipo y número de WhatsApp** — lo que sobrevive de 2.3 y 2.5. Minutos de
   trabajo, cero código.
3. **4.1 (formulario real)** — cerrar el loop de conversión.
4. **3.2 (video en hero)** — el salto de percepción más grande, pero pide producción.
5. Resto por oportunidad.
