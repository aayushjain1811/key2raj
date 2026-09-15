import type { Metadata } from "next";
import Link from "next/link";
import PropertyBrowser from "@/components/properties/PropertyBrowser";
import CtaBand from "@/components/public/CtaBand";
import { getPublishedProperties } from "@/lib/properties";
import type { Filters } from "@/components/properties/filters";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Residences, commercial space and land across Delhi NCR — apartments, villas, penthouses, plots and offices.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };

  const initial: Partial<Filters> = {
    cat: (one("cat") as Filters["cat"]) || "",
    loc: one("loc"),
    kind: one("kind"),
    budget: one("budget"),
    bhk: one("bhk"),
    status: one("status"),
    q: one("q"),
  };

  let properties: Awaited<ReturnType<typeof getPublishedProperties>> = [];
  let failed = false;
  try {
    properties = await getPublishedProperties();
  } catch (error) {
    console.error("Properties page could not load:", error);
    failed = true;
  }

  return (
    <>
      <section className="page-head blueprint">
        <div className="shell">
          <p className="crumbs">
            <Link href="/">Home</Link> / <span>Properties</span>
          </p>
          <h1 className="h-xl">Properties</h1>
          <p className="lede" style={{ color: "rgba(248,244,234,.72)" }}>
            Residences, commercial space and land across Delhi NCR. Every listing here is visited and verified
            before it is published.
          </p>
        </div>
      </section>

      <section className="band-tight band-ivory">
        <div className="shell">
          {failed ? (
            <div className="empty">
              <h3>Unable to load properties</h3>
              <p className="lede" style={{ marginInline: "auto" }}>
                Something went wrong at our end. Please refresh the page, or call us and we will send the
                listings across directly.
              </p>
            </div>
          ) : (
            <PropertyBrowser properties={properties} initial={initial} />
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
