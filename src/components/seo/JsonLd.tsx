/**
 * Structured data — the description of this business that search
 * engines read but visitors never see. It is what lets Google show a
 * price, an address and an opening time beside a result instead of a
 * plain blue link.
 *
 * These are server components, so nothing here reaches the browser as
 * JavaScript. It is just a script tag full of JSON.
 */
import { siteConfig } from "@/config/site";
import type { Property } from "@/types";
import { PROPERTY_TYPE_LABELS } from "@/types";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

const base = () => siteConfig.siteUrl.replace(/\/$/, "");

/** The business itself. Rendered on every page via the layout. */
export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "@id": `${base()}/#organization`,
        name: `${siteConfig.brand} ${siteConfig.brandLine}`,
        alternateName: siteConfig.brand,
        url: base(),
        logo: siteConfig.logo ? `${base()}${siteConfig.logo}` : undefined,
        image: siteConfig.logo ? `${base()}${siteConfig.logo}` : undefined,
        description: siteConfig.description,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: "₹₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.geo.streetAddress,
          addressLocality: siteConfig.geo.locality,
          addressRegion: siteConfig.geo.region,
          postalCode: siteConfig.geo.postalCode,
          addressCountry: siteConfig.geo.country,
        },
        areaServed: siteConfig.geo.areasServed.map((name) => ({ "@type": "City", name })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "19:00",
          },
        ],
        sameAs: Object.values(siteConfig.social).filter((link) => link && link !== "#"),
        knowsAbout: siteConfig.keywords,
      }}
    />
  );
}

/** One property listing, with its price, size and location. */
export function PropertyJsonLd({ property }: { property: Property }) {
  const url = `${base()}/properties/${property.slug}`;
  const images = property.images.map((image) => image.url);

  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": property.purpose === "rent" ? "Apartment" : "SingleFamilyResidence",
          "@id": `${url}#listing`,
          name: property.title,
          description: property.summary || property.description.slice(0, 200),
          url,
          image: images.length ? images : undefined,
          numberOfRooms: property.bedrooms || undefined,
          numberOfBathroomsTotal: property.bathrooms || undefined,
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.area,
            unitText: property.areaUnit,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: property.address || property.location,
            addressLocality: property.city,
            addressRegion: siteConfig.geo.region,
            addressCountry: siteConfig.geo.country,
          },
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "INR",
            availability:
              property.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            url,
            seller: { "@id": `${base()}/#organization` },
          },
          additionalType: PROPERTY_TYPE_LABELS[property.propertyType],
        }}
      />

      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: base() },
            { "@type": "ListItem", position: 2, name: "Properties", item: `${base()}/properties` },
            { "@type": "ListItem", position: 3, name: property.title, item: url },
          ],
        }}
      />
    </>
  );
}

/** Lets Google show a search box under the result for this site. */
export function WebsiteJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: base(),
        name: `${siteConfig.brand} ${siteConfig.brandLine}`,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${base()}/properties?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}