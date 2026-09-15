import type { Metadata, Viewport } from "next";
import { Marcellus, Jost } from "next/font/google";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import "./globals.css";

/**
 * Fonts are downloaded at build time and served from our own domain,
 * which is faster than linking to Google Fonts. `display: swap` means
 * text is readable in a fallback font immediately rather than being
 * invisible while the font loads.
 */
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const title = `${siteConfig.brand} ${siteConfig.brandLine} — Property Consultants in ${siteConfig.geo.locality}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s — ${siteConfig.brand} ${siteConfig.brandLine}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: `${siteConfig.brand} ${siteConfig.brandLine}`,
  authors: [{ name: `${siteConfig.brand} ${siteConfig.brandLine}`, url: siteConfig.siteUrl }],
  creator: `${siteConfig.brand} ${siteConfig.brandLine}`,
  publisher: `${siteConfig.brand} ${siteConfig.brandLine}`,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: `${siteConfig.brand} ${siteConfig.brandLine}`,
    title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  category: "real estate",
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#160A32",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${marcellus.variable} ${jost.variable}`}>
      <head>
        {/* Opens the connection to the image host before an image asks
            for it, which removes a round trip on first paint. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body>
        {children}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </body>
    </html>
  );
}