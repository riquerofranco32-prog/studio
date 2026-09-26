import type { Metadata, Viewport } from "next";
import { Archivo, Chivo_Mono } from "next/font/google";
import { Navbar } from "@/components/sections/navbar";
import Se7enFooter from "@/components/footer/Se7enFooter";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SoundProvider } from "@/components/providers/sound-provider";
import { CommandPalette } from "@/components/ui/command-palette";
import { BookingModal } from "@/components/ui/booking-modal";
import { WhatsAppWidget } from "@/components/ui/whatsapp-widget";
import { SITE } from "@/data/site";
import { team } from "@/data/team";
import { capabilities } from "@/data/services";
import "./globals.css";

// Archivo y Chivo Mono: familias de Omnibus-Type (Buenos Aires), en lugar de la
// Geist que trae por defecto create-next-app.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

// Mismo fondo que --background en globals.css: pinta la barra del navegador en
// mobile del color de la página en vez de blanco.
export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const sameAs = [
  SITE.social.instagram,
  SITE.social.linkedin,
  SITE.social.github,
].filter((url): url is string => Boolean(url));

// Sólo datos reales de data/: nada de redes o direcciones inventadas.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/logo.png`,
  email: SITE.email,
  telephone: `+${SITE.whatsapp.replace(/\D/g, "")}`,
  address: { "@type": "PostalAddress", addressCountry: "AR" },
  areaServed: { "@type": "Country", name: "Argentina" },
  founder: team.map((member) => ({
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    ...(member.linkedin && { sameAs: [member.linkedin] }),
  })),
  knowsAbout: capabilities,
  ...(sameAs.length > 0 && { sameAs }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${chivoMono.variable}`}>
      <body className="antialiased selection:bg-accent selection:text-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <SoundProvider>
          <MotionProvider>
            <Navbar />
            <main>{children}</main>
            <Se7enFooter />
            <CommandPalette />
            <BookingModal />
            <WhatsAppWidget />
          </MotionProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
