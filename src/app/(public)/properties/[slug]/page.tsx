import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Gallery from "@/components/properties/Gallery";
import VideoSection from "@/components/properties/VideoSection";
import MapEmbed from "@/components/public/MapEmbed";
import { PropertyJsonLd } from "@/components/seo/JsonLd";
import PropertyCard from "@/components/properties/PropertyCard";
import CtaBand from "@/components/public/CtaBand";
import { BookVisitButton, WhatsAppButton } from "@/components/public/ActionButtons";
import { PinIcon, InfoIcon } from "@/components/icons";
import { getPublishedProperties, getPublishedPropertyBySlug } from "@/lib/properties";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from "@/types";
import { areaLabel, categoryOf, initials, priceLabel, toEmbedUrl } from "@/lib/format";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

/** Pre-builds a page for every published property at build time. */
export async function generateStaticParams() {
  try {
    const properties = await getPublishedProperties();
    return properties.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug).catch(() => null);
  if (!property) return { title: "Property not found" };

  const title = `${property.title} — ${property.subtitle} in ${property.city}`;
  const description = (
    property.summary || property.description.slice(0, 150)
  ).slice(0, 155);
  const image = property.images.find((i) => i.isFeatured)?.url ?? property.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteConfig.siteUrl}/properties/${property.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug).catch(() => null);
  if (!property) notFound();

  const all = await getPublishedProperties().catch(() => []);
  const related = all
    .filter((p) => p.id !== property.id && categoryOf(p) === categoryOf(property))
    .slice(0, 3);

  // Properties with no named consultant fall back to the business
  // owner, so every listing shows a real person to contact.
  const agentName = property.agentName || siteConfig.consultant.name;
  const agentRole = property.agentRole || siteConfig.consultant.role;
  const showConsultantPhoto =
    Boolean(siteConfig.consultant.photo) && agentName === siteConfig.consultant.name;

  const facts: [string, string][] = [
    [property.bedrooms ? `${property.bedrooms} BHK` : PROPERTY_TYPE_LABELS[property.propertyType], "Configuration"],
    [areaLabel(property), "Built-up area"],
    [property.bathrooms ? String(property.bathrooms) : "—", "Bathrooms"],
    [property.parking || "—", "Parking"],
    [property.facing || "—", "Facing"],
    [property.floor || "—", "Floor"],
    [property.possession || PROPERTY_STATUS_LABELS[property.status], "Status"],
    [property.city, "City"],
  ];

  return (
    <>
      <PropertyJsonLd property={property} />

      <section className="page-head blueprint">
        <div className="shell">
          <p className="crumbs">
            <Link href="/">Home</Link> / <Link href="/properties">Properties</Link> /{" "}
            <span>{property.title}</span>
          </p>
          <h1 className="h-xl">{property.title}</h1>
          <p
            style={{
              color: "var(--champagne)",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              fontSize: 12,
              marginTop: 14,
            }}
          >
            {property.subtitle} · {property.location}
          </p>
        </div>
      </section>

      <section className="band-tight band-ivory">
        <div className="shell">
          <Gallery images={property.images} title={property.title} />

          <div className="detail-layout" style={{ marginTop: "clamp(34px,4vw,54px)" }}>
            <div>
              <p className="pcard-loc" style={{ fontSize: 15 }}>
                <PinIcon />
                {property.location}
              </p>
              <p className="detail-price">{priceLabel(property)}</p>
              <p className="lede" style={{ marginTop: 14 }}>
                {property.summary}
              </p>

              <div className="keyfacts">
                {facts.map(([value, label]) => (
                  <div className="keyfact" key={label}>
                    <b>{value}</b>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <h2 className="h-md" style={{ marginBottom: 14 }}>
                About this property
              </h2>
              <p style={{ maxWidth: "64ch", whiteSpace: "pre-line" }}>{property.description}</p>

              <VideoSection
                videos={property.videos}
                embedUrl={toEmbedUrl(property.videoEmbedUrl)}
                title={property.title}
                poster={property.images.find((i) => i.isFeatured)?.url ?? property.images[0]?.url}
              />

              {property.highlights.length ? (
                <>
                  <hr className="rule-gold" style={{ margin: "38px 0" }} />
                  <p className="sub">Highlights</p>
                  <ul className="hl">
                    {property.highlights.map((h) => (
                      <li key={h}>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {property.amenities.length ? (
                <>
                  <hr className="rule-gold" style={{ margin: "38px 0" }} />
                  <p className="sub">Amenities</p>
                  <ul className="amen">
                    {property.amenities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <hr className="rule-gold" style={{ margin: "38px 0" }} />
              <p className="sub">Location</p>
              <MapEmbed
                address={property.address || property.location}
                label={property.title}
              />
            </div>

            <aside className="aside-card">
              <div className="agent">
                {showConsultantPhoto ? (
                  <span className="agent-av is-photo">
                    <Image
                      src={siteConfig.consultant.photo}
                      alt={`${agentName}, ${agentRole}`}
                      fill
                      sizes="52px"
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                ) : (
                  <span className="agent-av" aria-hidden="true">
                    {initials(agentName)}
                  </span>
                )}
                <div>
                  <b>{agentName}</b>
                  <span>{agentRole}</span>
                </div>
              </div>

              <p style={{ fontSize: "14.5px", color: "var(--ink-soft)", marginBottom: 20 }}>
                Ask anything about this property — availability, paperwork, or what the neighbours are like at
                8am.
              </p>

              <div className="aside-acts">
                <BookVisitButton propertyId={property.id} className="btn btn-gold btn-block" />
                <WhatsAppButton about={property.title} className="btn btn-wa btn-block">
                  Enquire on WhatsApp
                </WhatsAppButton>
                <a className="btn btn-outline btn-block" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                  Call {siteConfig.phone}
                </a>
              </div>

              {property.status !== "available" ? (
                <p className="modal-note" style={{ marginTop: 20 }}>
                  <InfoIcon />
                  <span>
                    This property is currently marked{" "}
                    <strong>{PROPERTY_STATUS_LABELS[property.status]}</strong>. Ask us about similar options.
                  </span>
                </p>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="band band-white">
          <div className="shell">
            <div className="head-split">
              <div>
                <p className="eyebrow">Also worth seeing</p>
                <h2 className="h-lg">Similar properties</h2>
              </div>
            </div>
            <div className="grid-props">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p} delay={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}