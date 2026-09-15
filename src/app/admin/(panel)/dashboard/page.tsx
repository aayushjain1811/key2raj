import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { getAllProperties } from "@/lib/properties";
import { getAllBookings } from "@/lib/bookings";
import { getAllEnquiries } from "@/lib/enquiries";
import { priceLabel, prettyDate } from "@/lib/format";
import { PROPERTY_STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await requireAdmin();

  const [properties, bookings, enquiries] = await Promise.all([
    getAllProperties().catch(() => []),
    getAllBookings().catch(() => []),
    getAllEnquiries().catch(() => []),
  ]);

  const kpis: [string, number, boolean][] = [
    ["Total properties", properties.length, false],
    ["Published", properties.filter((p) => p.published).length, false],
    ["Featured", properties.filter((p) => p.featured).length, false],
    ["Sold", properties.filter((p) => p.status === "sold").length, false],
    ["For rent", properties.filter((p) => p.purpose === "rent").length, false],
    ["New bookings", bookings.filter((b) => b.status === "new").length, true],
    ["Pending visits", bookings.filter((b) => ["contacted", "confirmed"].includes(b.status)).length, false],
    ["New enquiries", enquiries.filter((e) => e.status === "new").length, true],
  ];

  return (
    <AdminShell admin={admin} title="Dashboard">
      <div className="kpis">
        {kpis.map(([label, value, gold]) => (
          <div className={`kpi${gold ? " is-gold" : ""}`} key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="card card-pad">
        <div className="form-actions">
          <Link className="btn btn-ink btn-sm" href="/admin/properties/new">
            + Add property
          </Link>
          <Link className="btn btn-outline btn-sm" href="/admin/bookings">
            View bookings
          </Link>
          <Link className="btn btn-outline btn-sm" href="/admin/enquiries">
            View enquiries
          </Link>
        </div>
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <h2>Recent bookings</h2>
            <Link className="btn-mini" href="/admin/bookings">
              All
            </Link>
          </div>
          {bookings.length ? (
            <div className="tbl-wrap">
              <table className="tbl" style={{ minWidth: 0 }}>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td>
                        <span className="tbl-title">{b.customerName}</span>
                        <span className="tbl-sub">{b.propertyTitle}</span>
                      </td>
                      <td className="tbl-sub">{prettyDate(b.visitDate)}</td>
                      <td>
                        <span className={`tag${b.status === "new" ? " tag-gold" : ""}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="blank">
              <b>No bookings yet</b>
              <span>Site visit requests will appear here.</span>
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Recent enquiries</h2>
            <Link className="btn-mini" href="/admin/enquiries">
              All
            </Link>
          </div>
          {enquiries.length ? (
            <div className="tbl-wrap">
              <table className="tbl" style={{ minWidth: 0 }}>
                <tbody>
                  {enquiries.slice(0, 5).map((e) => (
                    <tr key={e.id}>
                      <td>
                        <span className="tbl-title">{e.customerName}</span>
                        <span className="tbl-sub">{e.propertyTitle}</span>
                      </td>
                      <td className="tbl-sub">{e.phone}</td>
                      <td>
                        <span className={`tag${e.status === "new" ? " tag-gold" : ""}`}>{e.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="blank">
              <b>No enquiries yet</b>
              <span>Messages from the contact page will appear here.</span>
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Recently added properties</h2>
          <Link className="btn-mini" href="/admin/properties">
            Manage
          </Link>
        </div>
        {properties.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <tbody>
                {properties.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="tbl-title">{p.title}</span>
                      <span className="tbl-sub">{p.location}</span>
                    </td>
                    <td>{priceLabel(p)}</td>
                    <td>
                      <span className="tag tag-purple">{PROPERTY_STATUS_LABELS[p.status]}</span>
                    </td>
                    <td>
                      <span className={`tag ${p.published ? "tag-live" : "tag-off"}`}>
                        {p.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="tbl-sub">{prettyDate(p.createdAt.slice(0, 10))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="blank">
            <b>No properties yet</b>
            <span>
              Run <code>npm run seed</code> to load the demo listings, or add your first property.
            </span>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
