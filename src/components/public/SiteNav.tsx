"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { BookVisitButton, WhatsAppButton } from "./ActionButtons";
import { NAV_ITEMS, siteConfig } from "@/config/site";

export default function SiteNav() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the page changes.
  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`nav${stuck ? " is-stuck" : ""}`}>
        <div className="shell nav-inner">
          <Logo />
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <BookVisitButton className="btn btn-gold btn-sm nav-cta" />
          <button
            className="burger"
            type="button"
            aria-expanded={drawer}
            aria-controls="drawer"
            aria-label={drawer ? "Close menu" : "Open menu"}
            onClick={() => setDrawer((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <nav
        className={`drawer${drawer ? " is-open" : ""}`}
        id="drawer"
        aria-label="Mobile navigation"
        aria-hidden={!drawer}
      >
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="drawer-foot">
          <BookVisitButton className="btn btn-gold" />
          <WhatsAppButton about="a property" className="btn btn-ghost">
            WhatsApp us
          </WhatsAppButton>
          <p style={{ color: "rgba(248,244,234,.55)", fontSize: 13, marginTop: 8 }}>
            {siteConfig.phone} · {siteConfig.email}
          </p>
        </div>
      </nav>
    </>
  );
}
