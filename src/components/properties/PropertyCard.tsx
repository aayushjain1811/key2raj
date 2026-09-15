import Link from "next/link";
import Photo from "@/components/Photo";
import { PinIcon } from "@/components/icons";
import { BookVisitButton } from "@/components/public/ActionButtons";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS, type Property } from "@/types";
import { priceLabel } from "@/lib/format";

/**
 * The approved property card, unchanged in look. The only difference
 * from the old build is that every value now comes from Firestore.
 */
export default function PropertyCard({ property, delay = 0 }: { property: Property; delay?: number }) {
  // An available property shows its possession line ("Ready to Move").
  // Anything else shows the status itself, so SOLD and RENTED are loud.
  const chip =
    property.status === "available" && property.possession
      ? property.possession
      : PROPERTY_STATUS_LABELS[property.status];

  const cover = property.images.find((i) => i.isFeatured) ?? property.images[0];

  return (
    <article className="pcard reveal" data-d={delay}>
      <div className="pcard-media">
        <span className="chip">{chip}</span>
        {property.featured ? <span className="chip chip-demo">Featured</span> : null}
        <Photo
          src={cover?.url}
          alt={property.title}
          sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw"
        />
        <span className="pcard-price">
          {priceLabel(property)}
          <small>{PROPERTY_TYPE_LABELS[property.propertyType]}</small>
        </span>
      </div>

      <div className="pcard-body">
        <p className="pcard-type">{property.subtitle}</p>
        <h3>{property.title}</h3>
        <p className="pcard-loc">
          <PinIcon />
          {property.location}
        </p>
        <p className="pcard-desc">{property.summary}</p>

        <div className="spec-row">
          <div className="spec">
            <b>{property.bedrooms ? `${property.bedrooms} BHK` : "—"}</b>
            <span>Config</span>
          </div>
          <div className="spec">
            <b>{property.area.toLocaleString("en-IN")}</b>
            <span>{property.areaUnit.replace(".", "").replace("sqft", "Sq.ft.").replace("sqyd", "Sq. yd.").replace("sqm", "Sq. m.")}</span>
          </div>
          <div className="spec">
            <b>{property.city}</b>
            <span>City</span>
          </div>
        </div>

        <div className="pcard-acts">
          <Link className="btn btn-ink btn-sm" href={`/properties/${property.slug}`}>
            View property
          </Link>
          <BookVisitButton propertyId={property.id} className="btn btn-outline btn-sm">
            Book visit
          </BookVisitButton>
        </div>
      </div>
    </article>
  );
}
