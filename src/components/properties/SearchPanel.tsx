"use client";

import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, type PropertyType, type PropertyStatus } from "@/types";
import { budgetsFor, type Filters } from "./filters";

const TABS: [Filters["cat"], string][] = [
  ["buy", "Buy"],
  ["rent", "Rent"],
  ["commercial", "Commercial"],
  ["plots", "Plots"],
];

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  onSubmit: (next: Filters) => void;
  locations: string[];
  types: PropertyType[];
  statuses: PropertyStatus[];
}

/** The glass search panel that straddles the hero. Design unchanged. */
export default function SearchPanel({ filters, onChange, onSubmit, locations, types, statuses }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <form
      className="search"
      role="search"
      aria-label="Property search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filters);
      }}
    >
      <div className="search-tabs" role="tablist">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            className="search-tab"
            type="button"
            role="tab"
            aria-selected={filters.cat === value}
            onClick={() => set({ cat: value, budget: "" })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="search-grid">
        <div className="field">
          <label htmlFor="fLoc">Location</label>
          <select id="fLoc" value={filters.loc} onChange={(e) => set({ loc: e.target.value })}>
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fKind">Property type</label>
          <select id="fKind" value={filters.kind} onChange={(e) => set({ kind: e.target.value })}>
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {PROPERTY_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fBudget">Budget</label>
          <select id="fBudget" value={filters.budget} onChange={(e) => set({ budget: e.target.value })}>
            {budgetsFor(filters.cat).map(([value, label]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fBhk">Bedrooms</label>
          <select id="fBhk" value={filters.bhk} onChange={(e) => set({ bhk: e.target.value })}>
            <option value="">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5 BHK +</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="fStatus">Status</label>
          <select id="fStatus" value={filters.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {PROPERTY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="search-go">
          <button className="btn btn-ink" type="submit">
            Search properties
          </button>
        </div>
      </div>
    </form>
  );
}
