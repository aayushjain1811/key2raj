"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { removeProperty, toggleFlag, changePropertyStatus } from "@/app/admin/actions";
import { priceLabel, prettyDate } from "@/lib/format";
import {
  PROPERTY_STATUSES,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
  type PropertyStatus,
} from "@/types";

export default function PropertyTable({ properties }: { properties: Property[] }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "live" | "draft" | "featured">("all");
  const [confirming, setConfirming] = useState<Property | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (view === "live" && !p.published) return false;
      if (view === "draft" && p.published) return false;
      if (view === "featured" && !p.featured) return false;
      if (!needle) return true;
      return [p.title, p.location, p.city, p.slug].join(" ").toLowerCase().includes(needle);
    });
  }, [properties, query, view]);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) => {
    setError("");
    startTransition(async () => {
      const result = await fn();
      if (!result.ok && result.message) setError(result.message);
    });
  };

  return (
    <>
      {error ? <p className="note note-err">{error}</p> : null}

      <section className="card">
        <div className="card-head">
          <h2>Properties</h2>
          <input
            type="search"
            placeholder="Search title, area or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: "1px solid rgba(36,16,79,.22)",
              borderRadius: 2,
              padding: "8px 12px",
              fontSize: 13,
              minWidth: 220,
            }}
          />
          <select className="mini" value={view} onChange={(e) => setView(e.target.value as typeof view)}>
            <option value="all">All</option>
            <option value="live">Published</option>
            <option value="draft">Drafts</option>
            <option value="featured">Featured</option>
          </select>
          <Link className="btn btn-ink btn-sm" href="/admin/properties/new">
            + Add property
          </Link>
        </div>

        {rows.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Live</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const cover = p.images.find((i) => i.isFeatured) ?? p.images[0];
                  return (
                    <tr key={p.id}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="tbl-thumb" src={cover?.url || ""} alt="" />
                      </td>
                      <td>
                        <span className="tbl-title">{p.title}</span>
                        <span className="tbl-sub">/{p.slug}</span>
                      </td>
                      <td className="tbl-sub">{p.location}</td>
                      <td className="tbl-sub">{PROPERTY_TYPE_LABELS[p.propertyType]}</td>
                      <td className="tbl-sub">{p.purpose === "rent" ? "Rent" : "Buy"}</td>
                      <td>{priceLabel(p)}</td>
                      <td>
                        <select
                          className="mini"
                          value={p.status}
                          disabled={pending}
                          onChange={(e) =>
                            run(() => changePropertyStatus(p.id, e.target.value as PropertyStatus))
                          }
                        >
                          {PROPERTY_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {PROPERTY_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className={`tag ${p.published ? "tag-live" : "tag-off"}`}
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => toggleFlag(p.id, "published", !p.published))}
                        >
                          {p.published ? "Live" : "Draft"}
                        </button>
                      </td>
                      <td>
                        <button
                          className={`tag ${p.featured ? "tag-gold" : "tag-off"}`}
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => toggleFlag(p.id, "featured", !p.featured))}
                        >
                          {p.featured ? "Featured" : "No"}
                        </button>
                      </td>
                      <td className="tbl-sub">{prettyDate(p.createdAt.slice(0, 10))}</td>
                      <td>
                        <div className="row-acts">
                          <Link className="btn-mini" href={`/admin/properties/${p.id}/edit`}>
                            Edit
                          </Link>
                          <Link className="btn-mini" href={`/properties/${p.slug}`} target="_blank">
                            View
                          </Link>
                          <button
                            className="btn-mini is-danger"
                            type="button"
                            onClick={() => setConfirming(p)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="blank">
            <b>No properties found</b>
            <span>Try a different search, or add your first property.</span>
          </div>
        )}
      </section>

      {confirming ? (
        <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="delTitle">
          <div className="dlg-veil" onClick={() => setConfirming(null)} />
          <div className="dlg-box">
            <h3 id="delTitle">Delete property?</h3>
            <p>
              <strong>{confirming.title}</strong> and its photographs will be removed. This action cannot be
              undone.
            </p>
            <div className="dlg-acts">
              <button className="btn btn-outline btn-sm" type="button" onClick={() => setConfirming(null)}>
                Cancel
              </button>
              <button
                className="btn btn-sm"
                type="button"
                disabled={pending}
                style={{ background: "#B3261E", color: "#fff", borderColor: "#B3261E" }}
                onClick={() => {
                  const id = confirming.id;
                  setConfirming(null);
                  run(() => removeProperty(id));
                }}
              >
                {pending ? "Deleting…" : "Delete property"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
