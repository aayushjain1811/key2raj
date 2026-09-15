import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedProperties } from "@/lib/properties";

/**
 * The list of pages search engines should crawl, rebuilt automatically.
 * Publish a property and it appears here; unpublish it and it leaves.
 * Reachable at /sitemap.xml — submit that to Google Search Console.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const properties = await getPublishedProperties();
    return [
      ...staticPages,
      ...properties.map((property) => ({
        url: `${base}/properties/${property.slug}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticPages;
  }
}