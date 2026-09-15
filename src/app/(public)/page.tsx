import Link from "next/link";
import Photo from "@/components/Photo";
import PropertyCard from "@/components/properties/PropertyCard";
import HomeSearch from "@/components/properties/HomeSearch";
import CtaBand from "@/components/public/CtaBand";
import ProcessBlock from "@/components/public/ProcessBlock";
import { BookVisitButton, WhatsAppButton } from "@/components/public/ActionButtons";
import { TickIcon } from "@/components/icons";
import { getPublishedProperties } from "@/lib/properties";
import { SERVICES } from "@/config/services";
import { IMG, STATS, WHY_POINTS, siteConfig } from "@/config/site";
import type { PropertyStatus, PropertyType } from "@/types";

// Rebuilt at most once a minute, and immediately whenever the admin
// saves a property (see revalidatePath in the admin actions).
export const revalidate = 60;

export default async function HomePage() {
  let properties: Awaited<ReturnType<typeof getPublishedProperties>> = [];
  try {
    properties = await getPublishedProperties();
  } catch (error) {
    console.error("Home page could not load properties:", error);
  }

  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const locations = [...new Set(properties.map((p) => p.location))].sort();
  const types = [...new Set(properties.map((p) => p.propertyType))].sort() as PropertyType[];
  const statuses = [...new Set(properties.map((p) => p.status))].sort() as PropertyStatus[];

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Photo src={IMG.hero} alt="Modern residential tower at dusk" priority sizes="100vw" />
        </div>
        <div className="hero-wash" />
        <div className="shell hero-body">
          <div className="hero-inner">
            <p className="hero-kicker">
              <i />
              {siteConfig.brand} {siteConfig.brandLine}
            </p>
            <h1>
              <span className="ln">
                <span>Every key opens</span>
              </span>
              <span className="ln">
                <span>a door. Ours opens</span>
              </span>
              <span className="ln">
                <span>the right one.</span>
              </span>
            </h1>
            <p className="hero-lede">
              {siteConfig.headline} — property consultancy across Delhi NCR: apartments, villas, commercial
              space and land, matched to how you actually live and invest.
            </p>
            <ul className="hero-modes">
              {siteConfig.tagline.split("•").map((t) => (
                <li key={t}>{t.trim()}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <Link className="btn btn-gold" href="/properties">
                Explore properties
              </Link>
              <BookVisitButton className="btn btn-ghost" />
              <WhatsAppButton about="your listings" className="btn btn-ghost">
                WhatsApp us
              </WhatsAppButton>
            </div>
          </div>
        </div>
        <div className="hero-index">
          <b>1,200+</b>
          <small>Families settled since 2008</small>
        </div>
      </section>

      <div className="shell search-wrap">
        <HomeSearch locations={locations} types={types} statuses={statuses} />
      </div>

      <section className="band band-ivory">
        <div className="shell">
          <div className="head-split">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="h-lg">Currently on our books</h2>
            </div>
            <p className="lede" style={{ maxWidth: "36ch" }}>
              Each of these has been walked by a member of our team before it reached this page.
            </p>
          </div>

          {featured.length ? (
            <div className="grid-props">
              {featured.map((p, i) => (
                <PropertyCard key={p.id} property={p} delay={i % 3} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No featured properties yet</h3>
              <p className="lede" style={{ marginInline: "auto" }}>
                Mark a property as featured in the admin panel and it will appear here.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(34px,4vw,52px)" }}>
            <Link className="btn btn-outline" href="/properties">
              View all properties
            </Link>
          </div>
        </div>
      </section>

      <section className="band band-dark blueprint on-dark">
        <div className="shell">
          <div className="head-split">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="h-lg">
                Seven ways we work
                <br />
                with property
              </h2>
            </div>
            <p className="lede" style={{ maxWidth: "36ch" }}>
              Buying, selling, letting or holding — the advice changes, the standard doesn&apos;t.
            </p>
          </div>
          <div className="grid-svc">
            {SERVICES.slice(0, 6).map((s, i) => (
              <article className="svc reveal" data-d={i % 3} key={s.id}>
                <div className="svc-photo">
                  <Photo src={s.image} alt="" sizes="(max-width: 680px) 100vw, 33vw" />
                </div>
                <p className="svc-num">{String(i + 1).padStart(2, "0")}</p>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
                <Link className="svc-link" href="/services">
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="shell split">
          <div className="split-media reveal">
            <Photo
              src={IMG.lobby}
              alt="Reception of a premium residential development"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="reveal" data-d="1">
            <p className="eyebrow">Why {siteConfig.brand}</p>
            <h2 className="h-lg">
              The part of this job
              <br />
              that isn&apos;t the listing
            </h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Anyone can send you a photograph of a flat. The work is knowing which of them is wrong for you,
              and saying so before you have paid for it.
            </p>
            <ul className="why-list">
              {WHY_POINTS.map(([title, detail]) => (
                <li key={title}>
                  <TickIcon />
                  <div>
                    <b>{title}</b>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="btn btn-ink" href="/about">
              More about us
            </Link>
          </div>
        </div>
      </section>

      <ProcessBlock dark />

      <section className="band-tight band-deep">
        <div className="shell">
          <div className="stats">
            {STATS.map(([value, label]) => (
              <div className="stat reveal" key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
