import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Tells search engines what to crawl. The admin panel and the API are
 * closed off — not for security (they are protected properly), but so
 * they never turn up in search results.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}