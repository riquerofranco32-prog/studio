# Brief de mejoras — landing de Se7en Studio

Prompt completo para ejecutar en una próxima sesión (Claude Code u otro agente) contra
este repo. Cada ítem referencia archivo y línea real — no son sugerencias genéricas.

## Contexto para el agente

Repo: `riquerofranco32-prog/studio`, portfolio de un estudio de 2 personas (Next.js 16 +
TypeScript + Tailwind v4 + Framer Motion, sin backend activo — Supabase preparado pero
no conectado). Contenido local en `data/*.ts`. Ya está resuelto: nombre de marca real
("Se7en Studio"), copy en español, WhatsApp real, bios de equipo. Este brief cubre lo
que queda.

## 1. Contenido — cerrar los placeholders restantes

- `data/projects.ts`: los proyectos `apex-ai`, `altum-sci` y `pravilo` tienen `approach`
  y/o `design` con el texto literal "Detalles a agregar a medida que el caso de estudio
  se desarrolle." Además, los 6 proyectos tienen `outcome` genérico ("detalles de
  resultados a agregar"). Reemplazar con 1-2 frases reales por proyecto — ya hay
  contexto de estos productos en trabajo previo del estudio (Takefyy: restaurantes
  reales usando el producto; Sentinel: datos NASA FIRMS en vivo; Pravilo: primer centro
  del método en Argentina, en Plottier).
- `data/site.ts:11-13`: verificar que `instagram`, `linkedin` y `github` del estudio
  (no de las personas) sean cuentas reales que existen, o quitarlas — un link roto en
  el footer/contacto es peor que no tenerlo.
- `data/team.ts`: bios ya completadas. Falta decidir si el estudio quiere una sección
  "testimonios" — hoy está vacía y se auto-oculta (comportamiento correcto), no es
  urgente pero conviene sumar 1-2 reales de clientes de Takefyy/Pravilo/Poné La Pava
  antes de mostrar el sitio a un prospecto grande.

## 2. Bug menor — comentario desactualizado

- `components/sections/team-roster.tsx:19`: el comentario dice que el retrato flotante
  "es el caso hoy, porque `imageUrl` está vacío en data/team.ts" — pero `imageUrl` ya
  tiene fotos reales (`/team/franco-riquero.jpg`, `/team/federico-martin.jpg`). Limpiar
  el comentario para que no confunda a la próxima persona que toque el archivo.

## 3. Performance

- `next.config.ts` — confirmar que las imágenes de proyecto en `public/projects/*.jpg`
  están en AVIF/WebP o que Next las optimiza en build (el historial de commits
  `4c12b09` dice "activa AVIF", verificar que sigue activo tras cambios recientes).
- Correr `npm run build` y revisar el tamaño de bundle de `framer-motion` — se usa en
  hero, team-roster, process y varias secciones; confirmar que no se está importando
  la librería completa en cada archivo (tree-shaking real vs. import monolítico).
- Lighthouse pass completo (mobile + desktop) una vez que el contenido esté cerrado —
  no antes, para no medir dos veces.

## 4. Accesibilidad

- `components/sections/hero.tsx`: el punto animado "Disponibles para nuevos proyectos"
  usa `animate-ping` — confirmar que respeta `prefers-reduced-motion` (el resto del
  hero sí lo hace vía `useReducedMotion`, este punto específico no pasa por ese check).
- `components/sections/team-roster.tsx`: el retrato que sigue al cursor ya está bien
  resuelto (se desactiva con `reduceMotion`), doble-chequear que el foco por teclado
  (`onFocus`/`onBlur`) dispara el mismo estado que el hover — ya está implementado,
  solo falta test manual con Tab.
- Contraste de `text-muted` sobre `bg-background` — verificar que cumple AA en ambos
  temas si el sitio soporta light/dark (revisar `globals.css` para confirmar si hay
  modo claro implementado o el sitio es dark-only).

## 5. SEO

- `app/opengraph-image.tsx` y `app/twitter-image.tsx`: abrir y confirmar que la imagen
  generada usa el copy y color de marca actuales (post-rediseño con acento), no una
  versión vieja del naming "STUDIO".
- `app/sitemap.ts`: confirmar que incluye las 6 rutas `/work/[slug]` además del home.
- Structured data (JSON-LD `Organization`/`ProfessionalService`) — no existe todavía,
  vale la pena para que Google entienda que es un estudio con casos de estudio.

## 6. QA final antes de deploy

- Probar el botón de WhatsApp en mobile real (recién actualizado a
  `wa.me/5492994247985`) — confirmar que abre WhatsApp con el número correcto.
- Probar el flujo completo del formulario de contacto (`components/sections/contact.tsx`)
  en un cliente de mail real, no solo que abre `mailto:`.
- Mobile QA de `team-roster.tsx` — el retrato flotante está oculto en mobile
  (`hidden md:block`), confirmar que la fila sigue siendo legible y que el bio nuevo
  no rompe el layout en pantallas chicas.
- `git status` y confirmar deploy a Vercel una vez cerrado el contenido.

## Fuera de alcance de este brief

- Migración a Supabase como CMS (`supabase/schema.sql` ya está preparado, no es
  necesario para v1 según el propio README).
- Rediseño visual — el sistema de diseño actual (acento único, tipografía display,
  grid de fondo, marquees) está resuelto y consistente; no tocar salvo pedido explícito.
