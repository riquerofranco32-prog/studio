import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SoundProvider } from "@/components/providers/sound-provider";
import { CommandPalette } from "@/components/ui/command-palette";
import { BookingModal } from "@/components/ui/booking-modal";
import { FloatingStatusBar } from "@/components/ui/floating-status-bar";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";
import { VideoTheaterModal } from "@/components/ui/video-theater-modal";
import { SITE } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  sameAs: [
    SITE.social.instagram,
    SITE.social.linkedin,
    SITE.social.github,
  ].filter((url): url is string => Boolean(url)),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased selection:bg-accent selection:text-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ScrollProgress />
        <CustomCursor />
        <AuroraBackground />
        <SmoothScroll />
        <SoundProvider>
          <MotionProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CommandPalette />
            <BookingModal />
            <FloatingStatusBar />
            <ShortcutsModal />
            <VideoTheaterModal />
          </MotionProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
