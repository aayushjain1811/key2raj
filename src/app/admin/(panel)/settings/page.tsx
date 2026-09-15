import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/config/services";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const admin = await requireAdmin();

  const rows: [string, string][] = [
    ["Brand", `${siteConfig.brand} ${siteConfig.brandLine}`],
    ["Tagline", siteConfig.tagline],
    ["Phone", siteConfig.phone],
    ["WhatsApp number", siteConfig.whatsappNumber],
    ["Email", siteConfig.email],
    ["Office address", siteConfig.address.replace(/\n/g, " ")],
    ["Business hours", siteConfig.hours],
    ["RERA", siteConfig.rera],
  ];

  return (
    <AdminShell admin={admin} title="Settings">
      <p className="note note-info">
        These values come from <code>src/config/site.ts</code> and <code>.env.local</code>. Editing them from
        this screen is a later phase — for now, change the file and the whole website updates.
      </p>

      <section className="card">
        <div className="card-head">
          <h2>Business information</h2>
        </div>
        <div className="tbl-wrap">
          <table className="tbl" style={{ minWidth: 0 }}>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}>
                  <td style={{ width: 200 }}>
                    <span className="tbl-sub">{label}</span>
                  </td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Services</h2>
        </div>
        <div className="card-pad">
          <div className="row-acts">
            {SERVICES.map((s) => (
              <span className="tag tag-purple" key={s.id}>
                {s.title}
              </span>
            ))}
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Edit these in <code>src/config/services.ts</code>.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Your account</h2>
        </div>
        <div className="card-pad">
          <p style={{ margin: 0 }}>
            {admin.name} · {admin.email}
          </p>
          <p className="hint" style={{ marginTop: 8 }}>
            Role: {admin.role}. To add another administrator, run{" "}
            <code>npm run make-admin their@email.com</code>.
          </p>
        </div>
      </section>
    </AdminShell>
  );
}
