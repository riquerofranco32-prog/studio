# Clips de hover de las tarjetas de Trabajo

Opcionales. Si el proyecto no tiene clip, la tarjeta se queda con el JPG de
`public/projects/<slug>.jpg`, que es el comportamiento por defecto y no rompe
nada.

## Dónde los espera el código

Dos archivos por proyecto, con el slug exacto de `data/projects.ts`:

    public/projects/videos/<slug>.mp4
    public/projects/videos/<slug>.webm

Y hay que declararlos en `data/projects.ts`:

```ts
{
  slug: "takefyy",
  image: "/projects/takefyy.jpg",
  video: {
    mp4: "/projects/videos/takefyy.mp4",
    webm: "/projects/videos/takefyy.webm",
  },
  // …
}
```

El JPG sigue haciendo de `poster`, así que la tarjeta se ve igual que hoy hasta
que el cursor entra.

## Especificaciones

| | |
|---|---|
| Relación de aspecto | **4:3** — la tarjeta es `aspect-[4/3]` y cualquier otra cosa se recorta |
| Resolución | **1280×960** |
| Duración | **4–6 s**, en loop sin costura (el último frame tiene que pegar con el primero) |
| FPS | 24–30 |
| Audio | **ninguno** — sacar la pista, no silenciarla: pesa y no se usa |
| Peso máximo | **900 KB** el MP4, **700 KB** el WebM |

Formatos: **MP4 (H.264 High, yuv420p, `faststart`)** como base y **WebM (VP9)**
para los navegadores que lo prefieran. El `<source>` de WebM va primero.

## Comandos de referencia

```bash
ffmpeg -i fuente.mov -an -vf "scale=1280:960:force_original_aspect_ratio=increase,crop=1280:960,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -movflags +faststart takefyy.mp4
```

```bash
ffmpeg -i fuente.mov -an -vf "scale=1280:960:force_original_aspect_ratio=increase,crop=1280:960,fps=30" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 takefyy.webm
```

Si un clip se pasa del techo de peso, subir el `-crf` antes que bajar la
resolución: en un loop de 5 segundos a 1280×960 el ruido de compresión se nota
mucho menos que la falta de nitidez.

## Los clips se usan en dos lugares, con reglas distintas

**Fila de productos del hero** (`components/sections/hero-showcase.tsx`):
autoplay en loop, se ven solos. Los bytes se bajan en la primera carga —
`preload` no sirve para evitarlo, con autoplay el navegador lo ignora (medido:
`preload="metadata"` baja exactamente lo mismo que `preload="auto"`). Por eso
el peso de cada clip importa tanto acá.

**Grilla de Trabajo** (`components/work/project-card.tsx`): `preload="none"` y
play en hover. No baja un solo byte hasta que alguien pasa el cursor, y en
touch ni monta el `<video>`.

En los dos casos: nada con `prefers-reduced-motion`, y ninguno usa el atributo
`poster` — debajo está el `<Image>` de Next, que sirve AVIF al ancho real.
Poner `poster` además bajaría el JPG crudo.
