import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // El default de Next es sólo ['image/webp']. AVIF pesa bastante menos para
    // screenshots de sitios y el navegador cae solo a WebP si no lo soporta.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
