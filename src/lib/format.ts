/**
 * Small formatting helpers. Kept in one place so prices and areas look
 * the same everywhere on the site.
 */
import type { Property, Category, PropertyType } from "@/types";

/** 24500000 -> "₹2.45 Cr" · 52000 -> "₹52,000" */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "Price on request";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Rentals get "/ month" added. */
export function priceLabel(p: Pick<Property, "price" | "purpose">): string {
  const base = formatPrice(p.price);
  return p.purpose === "rent" ? `${base} / month` : base;
}

export function areaLabel(p: Pick<Property, "area" | "areaUnit">): string {
  return `${p.area.toLocaleString("en-IN")} ${p.areaUnit}`;
}

/**
 * Which search tab a property belongs under. Commercial and plot types
 * get their own tabs even though they are bought, not rented.
 */
export function categoryOf(p: Pick<Property, "purpose" | "propertyType">): Category {
  const commercial: PropertyType[] = ["commercial", "office", "shop"];
  const land: PropertyType[] = ["plot", "land"];
  if (commercial.includes(p.propertyType)) return "commercial";
  if (land.includes(p.propertyType)) return "plots";
  return p.purpose === "rent" ? "rent" : "buy";
}

/** "2026-09-15" -> "15 September 2026" */
export function prettyDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Turns a title into a URL-safe slug: "Villa Aurelia" -> "villa-aurelia" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Turns a YouTube or Vimeo link into the embeddable version.
 * Returns an empty string for anything it does not recognise, so the
 * player is simply not shown rather than showing a broken frame.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return parsed.toString();
      if (parsed.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/")[2]}`;
      }
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
    if (host === "player.vimeo.com") return parsed.toString();

    return "";
  } catch {
    return "";
  }
}