import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

// Satori (el motor detrás de ImageResponse) sólo soporta flexbox y un subconjunto
// de CSS: nada de grid, y cada nodo con más de un hijo necesita display:flex
// explícito. Las fuentes tienen que ser ttf/otf/woff — Geist llega como woff2 vía
// next/font, así que la tarjeta se apoya en layout y color, no en la tipografía.
export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 };
export const SOCIAL_CARD_ALT = `${SITE.name} — ${SITE.tagline}`;

const BACKGROUND = "#0a0a0b";
const FOREGROUND = "#f5f5f4";
const MUTED = "#8a8a8e";
const ACCENT = "#ff4d2e";
const BORDER = "rgba(245, 245, 244, 0.1)";

export function renderSocialCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BACKGROUND,
          color: FOREGROUND,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Satori no soporta filtros: un círculo daría un borde duro cruzando el
            titular, así que el calor de acento entra como degradado. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(115deg, rgba(255,77,46,0) 48%, rgba(255,77,46,0.16) 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: ACCENT,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: FOREGROUND,
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Líneas explícitas en vez de flex-wrap: el wrap automático dejaba
              huecos irregulares entre palabras. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.08,
            }}
          >
            <div style={{ display: "flex" }}>Construimos experiencias</div>
            <div style={{ display: "flex" }}>digitales para marcas que</div>
            <div style={{ display: "flex", color: ACCENT }}>avanzan.</div>
          </div>
          <div style={{ fontSize: 30, color: MUTED, maxWidth: 720 }}>
            Estrategia, diseño y tecnología — desde la primera idea hasta el
            producto final.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 28,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>
            Producto digital · Tecnología creativa
          </div>
          <div style={{ display: "flex", color: FOREGROUND }}>{SITE.email}</div>
        </div>
      </div>
    ),
    { ...SOCIAL_CARD_SIZE },
  );
}
