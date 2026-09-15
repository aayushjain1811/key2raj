"use client";

import { useMemo, useState } from "react";
import SearchPanel from "./SearchPanel";
import PropertyCard from "./PropertyCard";
import { WhatsAppButton } from "@/components/public/ActionButtons";
import { EMPTY_FILTERS, matches, sortProperties, type Filters } from "./filters";
import type { Property, PropertyType, PropertyStatus } from "@/types";

const QUICK: [Filters["cat"], string][] = [
  ["", "All"],
  ["buy", "For sale"],
  ["rent", "For rent"],
  ["commercial", "Commercial"],
  ["plots", "Plots"],
];

/**
 * The listing page. All filtering happens in the browser over the list
 * the server already sent, so changing a filter is instant.
 */
export default function PropertyBrowser({
  properties,
  initial,
}: {
  properties: Property[];
  initial: Partial<Filters>;
}) {
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, ...initial });

  const locations = useMemo(
    () => [...new Set(properties.map((p) => p.location))].sort(),
    [properties]
  );
  const types = useMemo(
    () => [...new Set(properties.map((p) => p.propertyType))].sort() as PropertyType[],
    [properties]
  );
  const statuses = useMemo(
    () => [...new Set(properties.map((p) => p.status))].sort() as PropertyStatus[],
    [properties]
  );

  const results = useMemo(
    () => sortProperties(properties.filter((p) => matches(p, filters)), filters.sort),
    [properties, filters]
  );

  const clear = () => setFilters({ ...EMPTY_FILTERS, cat: "" });

  return (
    <>
      <SearchPanel
        filters={filters}
        onChange={setFilters}
        onSubmit={setFilters}
        locations={locations}
        types={types}
        statuses={statuses}
      />

      <div className="filter-bar">
        <span
          style={{
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
          }}
        >
          Quick view
        </span>

        {QUICK.map(([value, label]) => (
          <button
            key={label}
            className="pill"
            type="button"
            aria-pressed={filters.cat === value}
            onClick={() => setFilters({ ...filters, cat: value, budget: "" })}
          >
            {label}
          </button>
        ))}

        <div className="field" style={{ minWidth: 170, marginLeft: 8 }}>
          <label htmlFor="fSearch" className="sr-only">
            Search properties
          </label>
          <input
            id="fSearch"
            type="search"
            placeholder="Search by name or area"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <div className="field" style={{ minWidth: 150 }}>
          <label htmlFor="fSort" className="sr-only">
            Sort
          </label>
          <select
            id="fSort"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="area-desc">Largest area</option>
          </select>
        </div>

        <button className="pill" type="button" onClick={clear}>
          Clear filters
        </button>

        <span className="result-count">
          {results.length} {results.length === 1 ? "property" : "properties"}
        </span>
      </div>

      {results.length ? (
        <div className="grid-props">
          {results.map((p, i) => (
            <PropertyCard key={p.id} property={p} delay={i % 3} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Nothing matches that combination yet</h3>
          <p className="lede" style={{ marginInline: "auto" }}>
            Widen the budget or clear a filter — or tell us the brief directly and we&apos;ll look for you.
          </p>
          <div className="cta-acts" style={{ marginTop: 24 }}>
            <button className="btn btn-outline" type="button" onClick={clear}>
              Clear all filters
            </button>
            <WhatsAppButton about="a property that isn't listed" className="btn btn-wa">
              Ask us directly
            </WhatsAppButton>
          </div>
        </div>
      )}
    </>
  );
}
