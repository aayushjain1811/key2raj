"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchPanel from "./SearchPanel";
import { EMPTY_FILTERS, type Filters } from "./filters";
import type { PropertyType, PropertyStatus } from "@/types";

/** The home-page panel. Searching here sends you to /properties. */
export default function HomeSearch({
  locations,
  types,
  statuses,
}: {
  locations: string[];
  types: PropertyType[];
  statuses: PropertyStatus[];
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  function go(next: Filters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value && value !== "newest") params.set(key, String(value));
    });
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <SearchPanel
      filters={filters}
      onChange={setFilters}
      onSubmit={go}
      locations={locations}
      types={types}
      statuses={statuses}
    />
  );
}
