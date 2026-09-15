import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-head blueprint" style={{ paddingBottom: "clamp(120px,14vw,180px)" }}>
      <div className="shell">
        <p className="crumbs">
          <Link href="/">Home</Link> / <span>Not found</span>
        </p>
        <h1 className="h-xl">That page has moved on</h1>
        <p className="lede" style={{ color: "rgba(248,244,234,.72)", marginBottom: 28 }}>
          The link may be old, or the property may no longer be listed. Start again from the listings.
        </p>
        <div className="cta-acts" style={{ justifyContent: "flex-start" }}>
          <Link className="btn btn-gold" href="/properties">
            Browse properties
          </Link>
          <Link className="btn btn-ghost" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
