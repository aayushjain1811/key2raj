import Link from "next/link";
import Logo from "./Logo";
import { WhatsAppButton } from "./ActionButtons";
import SecretAdminLink from "./SecretAdminLink";
import { SOCIAL_PATHS } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/config/services";

export default function SiteFooter() {
  const quick: [string, string][] = [
    ["/", "Home"],
    ["/properties", "All properties"],
    ["/about", "About us"],
    ["/contact", "Contact"],
  ];

  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo />
            <p style={{ fontSize: "14.5px", maxWidth: "34ch" }}>{siteConfig.footerBlurb}</p>
            <div className="socials">
              {Object.entries(SOCIAL_PATHS).map(([key, path]) => (
                <a
                  key={key}
                  href={siteConfig.social[key as keyof typeof siteConfig.social] ?? "#"}
                  aria-label={key}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Quick links</h4>
            <ul>
              {quick.map(([href, label]) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href="/services">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
            <ul>
              <li>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li style={{ whiteSpace: "pre-line", fontSize: 14 }}>{siteConfig.address}</li>
              <li style={{ fontSize: 14 }}>{siteConfig.hours}</li>
            </ul>
            <WhatsAppButton about="your listings" className="btn btn-wa btn-sm">
              WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        <div className="foot-bot">
          <span>
            <SecretAdminLink /> {new Date().getFullYear()} {siteConfig.brand} {siteConfig.brandLine}. All
            rights reserved.
          </span>
          <span>{siteConfig.rera}</span>
        </div>
      </div>
    </footer>
  );
}