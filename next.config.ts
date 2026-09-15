import type { NextConfig } from "next";

const config: NextConfig = {
  // Serves AVIF and WebP where the browser supports them, which is
  // typically a third to a half the size of the original JPEG.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    remotePatterns: [
      // Demo photography. Remove this entry once the client's own photos are in.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Firebase Storage — where uploaded property photos live.
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

// Compresses HTML, CSS and JS responses.
config.compress = true;
// Stops Next.js announcing itself in a response header.
config.poweredByHeader = false;

export default config;