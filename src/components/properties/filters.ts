import type { Property, Category } from "@/types";
import { categoryOf } from "@/lib/format";

export interface Filters {
  cat: Category | "";
  loc: string;
  kind: string;
  budget: string;
  bhk: string;
  status: string;
  q: string;
  sort: string;
}

export const EMPTY_FILTERS: Filters = {
  cat: "buy",
  loc: "",
  kind: "",
  budget: "",
  bhk: "",
  status: "",
  q: "",
  sort: "newest",
};

export const BUDGETS: Record<"sale" | "rent", [string, string][]> = {
  sale: [
    ["", "Any budget"],
    ["0-10000000", "Under ₹1 Cr"],
    ["10000000-25000000", "₹1 – 2.5 Cr"],
    ["25000000-50000000", "₹2.5 – 5 Cr"],
    ["50000000-", "Above ₹5 Cr"],
  ],
  rent: [
    ["", "Any budget"],
    ["0-50000", "Under ₹50,000"],
    ["50000-100000", "₹50,000 – ₹1 Lakh"],
    ["100000-200000", "₹1 – 2 Lakh"],
    ["200000-", "Above ₹2 Lakh"],
  ],
};

export const budgetsFor = (cat: string) => (cat === "rent" ? BUDGETS.rent : BUDGETS.sale);

/** Decides whether one property survives the current filters. */
export function matches(p: Property, f: Filters): boolean {
  if (f.cat && categoryOf(p) !== f.cat) return false;
  if (f.loc && p.location !== f.loc) return false;
  if (f.kind && p.propertyType !== f.kind) return false;
  if (f.status && p.status !== f.status) return false;

  if (f.bhk) {
    const n = Number(f.bhk);
    if (n === 5 ? p.bedrooms < 5 : p.bedrooms !== n) return false;
  }

  if (f.budget) {
    const [min, max] = f.budget.split("-");
    if (min && p.price < Number(min)) return false;
    if (max && p.price > Number(max)) return false;
  }

  if (f.q.trim()) {
    const needle = f.q.trim().toLowerCase();
    const haystack = [p.title, p.subtitle, p.location, p.city, p.summary].join(" ").toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

export function sortProperties(list: Property[], sort: string): Property[] {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "area-desc":
      return out.sort((a, b) => b.area - a.area);
    default:
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
