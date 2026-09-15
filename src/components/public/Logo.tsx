import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * The K2R lockup, used in the header, footer, admin sidebar and login.
 *
 * To use the real logo: put the file in /public and set
 * `logo: "/logo.svg"` in src/config/site.ts. Every place below updates
 * at once. Until then the built-in "K2" mark stands in.
 *
 * `showWordmark={false}` is for logos that already contain the words
 * KEY2RAJ, so the text is not printed twice.
 */
export default function Logo({
  href = "/",
  sub,
  showWordmark = true,
}: {
  href?: string;
  sub?: string;
  showWordmark?: boolean;
}) {
  const label = `${siteConfig.brand} ${siteConfig.brandLine}`;

  return (
    <Link className="logo" href={href} aria-label={`${label}, home`}>
      {siteConfig.logo ? (
        <Image
          src={siteConfig.logo}
          alt={label}
          width={160}
          height={38}
          priority
          className="logo-img"
        />
      ) : (
        <span className="logo-mark" aria-hidden="true">
          K2
        </span>
      )}

      {(!siteConfig.logo || showWordmark) && (
        <span className="logo-type">
          <span className="logo-name">{siteConfig.brand}</span>
          <span className="logo-sub">{sub || siteConfig.brandLine}</span>
        </span>
      )}
    </Link>
  );
}