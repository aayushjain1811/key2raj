"use client";

import Link from "next/link";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import { saveProperty } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import {
  AREA_UNITS,
  PROPERTY_STATUSES,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  type Property,
  type PropertyImage,
  type PropertyVideo,
} from "@/types";

function Err({ message }: { message?: string }) {
  return <span className="err">{message}</span>;
}

export default function PropertyForm({ property }: { property?: Property }) {
  const [images, setImages] = useState<PropertyImage[]>(property?.images ?? []);
  const [videos, setVideos] = useState<PropertyVideo[]>(property?.videos ?? []);
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(property?.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("images", JSON.stringify(images));
    formData.set("videos", JSON.stringify(videos));

    const result = await saveProperty(property?.id ?? null, formData);
    // On success the action redirects, so anything returned is a failure.
    if (result && !result.ok) {
      setErrors(result.fieldErrors ?? {});
      setMessage(result.message);
      setPending(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form className="adm-form" onSubmit={onSubmit} noValidate>
      {message ? <p className="note note-err">{message}</p> : null}

      <section className="card card-pad">
        <p className="legend">The basics</p>
        <div className="fieldset" style={{ marginTop: 16 }}>
          <div className={`field col-2${errors.title ? " has-err" : ""}`}>
            <label htmlFor="title">Property title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="The Marigold Residences"
            />
            <Err message={errors.title} />
          </div>

          <div className={`field col-2${errors.slug ? " has-err" : ""}`}>
            <label htmlFor="slug">Web address</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
            />
            <span className="hint">/properties/{slug || "your-property"}</span>
            <Err message={errors.slug} />
          </div>

          <div className={`field col-2${errors.subtitle ? " has-err" : ""}`}>
            <label htmlFor="subtitle">Type line</label>
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={property?.subtitle}
              placeholder="Luxury 3 BHK Apartment"
            />
            <Err message={errors.subtitle} />
          </div>

          <div className="field">
            <label htmlFor="propertyType">Property type</label>
            <select id="propertyType" name="propertyType" defaultValue={property?.propertyType ?? "apartment"}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROPERTY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="purpose">Purpose</label>
            <select id="purpose" name="purpose" defaultValue={property?.purpose ?? "buy"}>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={property?.status ?? "available"}>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PROPERTY_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="possession">Possession line</label>
            <input
              id="possession"
              name="possession"
              defaultValue={property?.possession}
              placeholder="Ready to Move"
            />
            <span className="hint">Shown on the card when the property is available.</span>
          </div>

          <div className={`field${errors.price ? " has-err" : ""}`}>
            <label htmlFor="price">Price in rupees</label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1000}
              defaultValue={property?.price}
              placeholder="24500000"
            />
            <span className="hint">Plain number. For rentals, the monthly rent.</span>
            <Err message={errors.price} />
          </div>

          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" defaultValue={property?.city} placeholder="Gurugram" />
            <Err message={errors.city} />
          </div>

          <div className={`field col-2${errors.location ? " has-err" : ""}`}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              defaultValue={property?.location}
              placeholder="Golf Course Extension Road, Gurugram"
            />
            <Err message={errors.location} />
          </div>

          <div className="field col-2">
            <label htmlFor="address">Full address</label>
            <input id="address" name="address" defaultValue={property?.address} />
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="legend">Specifications</p>
        <div className="fieldset" style={{ marginTop: 16 }}>
          <div className="field">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={property?.bedrooms ?? 0} />
          </div>
          <div className="field">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={property?.bathrooms ?? 0} />
          </div>
          <div className={`field${errors.area ? " has-err" : ""}`}>
            <label htmlFor="area">Area</label>
            <input id="area" name="area" type="number" min={0} defaultValue={property?.area} />
            <Err message={errors.area} />
          </div>
          <div className="field">
            <label htmlFor="areaUnit">Area unit</label>
            <select id="areaUnit" name="areaUnit" defaultValue={property?.areaUnit ?? "sq.ft."}>
              {AREA_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="parking">Parking</label>
            <input id="parking" name="parking" defaultValue={property?.parking} placeholder="2 Covered" />
          </div>
          <div className="field">
            <label htmlFor="facing">Facing</label>
            <input id="facing" name="facing" defaultValue={property?.facing} placeholder="East" />
          </div>
          <div className="field">
            <label htmlFor="floor">Floor</label>
            <input id="floor" name="floor" defaultValue={property?.floor} placeholder="14 of 22" />
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="legend">Words</p>
        <div className="fieldset" style={{ marginTop: 16 }}>
          <div className={`field col-2${errors.summary ? " has-err" : ""}`}>
            <label htmlFor="summary">One-line summary</label>
            <input
              id="summary"
              name="summary"
              defaultValue={property?.summary}
              placeholder="Corner residence with a double-height living room and skyline views."
            />
            <span className="hint">Shown on the property card.</span>
            <Err message={errors.summary} />
          </div>

          <div className={`field col-2${errors.description ? " has-err" : ""}`}>
            <label htmlFor="description">Full description</label>
            <textarea id="description" name="description" rows={7} defaultValue={property?.description} />
            <Err message={errors.description} />
          </div>

          <div className="field">
            <label htmlFor="highlights">Highlights</label>
            <textarea
              id="highlights"
              name="highlights"
              rows={5}
              defaultValue={property?.highlights.join("\n")}
              placeholder="One per line"
            />
            <span className="hint">One per line.</span>
          </div>

          <div className="field">
            <label htmlFor="amenities">Amenities</label>
            <textarea
              id="amenities"
              name="amenities"
              rows={5}
              defaultValue={property?.amenities.join("\n")}
              placeholder="One per line"
            />
            <span className="hint">One per line.</span>
          </div>

          <div className="field">
            <label htmlFor="agentName">Consultant name</label>
            <input id="agentName" name="agentName" defaultValue={property?.agentName} />
          </div>
          <div className="field">
            <label htmlFor="agentRole">Consultant role</label>
            <input id="agentRole" name="agentRole" defaultValue={property?.agentRole} />
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="legend">Photographs</p>
        <div style={{ marginTop: 16 }}>
          <ImageUploader propertyId={property?.id ?? "unassigned"} images={images} onChange={setImages} />
        </div>
      </section>

      <section className="card card-pad">
        <p className="legend">Video</p>
        <div style={{ marginTop: 16 }}>
          <VideoUploader propertyId={property?.id ?? "unassigned"} videos={videos} onChange={setVideos} />

          <div className="field" style={{ marginTop: 22 }}>
            <label htmlFor="videoEmbedUrl">Or paste a YouTube / Vimeo link</label>
            <input
              id="videoEmbedUrl"
              name="videoEmbedUrl"
              defaultValue={property?.videoEmbedUrl}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <span className="hint">
              Cheaper than hosting the file yourself, and it plays on slow connections.
            </span>
            <Err message={errors.videoEmbedUrl} />
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="legend">Visibility</p>
        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          <label className="check">
            <input type="checkbox" name="published" defaultChecked={property?.published ?? false} />
            <span>Published — visible on the public website</span>
          </label>
          <label className="check">
            <input type="checkbox" name="featured" defaultChecked={property?.featured ?? false} />
            <span>Featured — shown on the home page</span>
          </label>
        </div>
      </section>

      <div className="form-actions">
        <button className="btn btn-ink" type="submit" disabled={pending}>
          {pending ? "Saving…" : property ? "Save changes" : "Create property"}
        </button>
        <Link className="btn btn-outline" href="/admin/properties">
          Cancel
        </Link>
      </div>
    </form>
  );
}