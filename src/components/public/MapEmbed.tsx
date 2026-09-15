/**
 * A map built from a plain address string — no coordinates to look up,
 * nothing to maintain. Whatever the admin types as the address is what
 * gets pinned.
 *
 * Two modes:
 *   · With NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY set, it uses Google's
 *     official Maps Embed API.
 *   · Without a key it falls back to Google's keyless embed, which is
 *     fine for a demo and costs nothing.
 *
 * It is a plain iframe with loading="lazy", so nothing downloads until
 * the visitor scrolls near it.
 */
import { siteConfig } from "@/config/site";

function embedSrc(address: string): string {
  const query = encodeURIComponent(address.replace(/\n/g, ", ").trim());
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}&zoom=15`
    : `https://www.google.com/maps?q=${query}&z=15&output=embed`;
}

function directionsHref(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address.replace(/\n/g, ", ").trim()
  )}`;
}

export default function MapEmbed({
  address,
  label,
  ratio = "16/7",
}: {
  address: string;
  /** Shown above the map and used for the frame's accessible name. */
  label?: string;
  ratio?: string;
}) {
  // No address typed in yet — keep the old placeholder panel so the
  // page never shows an empty grey box or a map of nowhere.
  if (!address?.trim()) {
    return (
      <div className="map-ph" style={{ aspectRatio: ratio }}>
        <div>
          <b>Address to be confirmed</b>
          <span>Add an address to this property and the map appears here.</span>
        </div>
      </div>
    );
  }

  const display = address.replace(/\n/g, ", ");

  return (
    <div>
      <div className="map-embed" style={{ aspectRatio: ratio }}>
        <iframe
          src={embedSrc(address)}
          title={`Map showing ${label || display}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="map-foot">
        <span>{display}</span>
        <a
          className="btn btn-outline btn-sm"
          href={directionsHref(address)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}

/** The office map used on the contact page. */
export function OfficeMap() {
  return <MapEmbed address={siteConfig.address} label={`${siteConfig.brand} office`} ratio="21/7" />;
}