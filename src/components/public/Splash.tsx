/**
 * Opening splash. Shown on a full page load, then it fades itself out
 * and stops receiving clicks.
 *
 * It uses the real logo when one is set in src/config/site.ts, and the
 * built-in "K2" mark otherwise. Moving between pages inside the site
 * does not reload, so visitors see this once, not on every click.
 * To remove it, delete this component from src/app/(public)/layout.tsx.
 */
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-inner">
        {siteConfig.logo ? (
          <Image
            src={siteConfig.logo}
            alt=""
            width={280}
            height={280}
            priority
            className="splash-logo"
          />
        ) : (
          <span className="splash-mark">K2</span>
        )}
        <span className="splash-name">{siteConfig.brand}</span>
        <span className="splash-sub">{siteConfig.brandLine}</span>
        <i className="splash-rule" />
      </div>
    </div>
  );
}