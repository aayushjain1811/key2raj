/** Quiet loading state for the admin panel. */
export default function AdminLoading() {
  return (
    <div style={{ padding: "clamp(20px,2.6vw,34px)", display: "grid", gap: 20 }}>
      <div className="kpis">
        {[0, 1, 2, 3].map((i) => (
          <div className="kpi" key={i}>
            <div className="sk sk-line" style={{ width: 70, height: 32 }} />
            <div className="sk sk-line" style={{ width: 110, height: 10, marginTop: 12 }} />
          </div>
        ))}
      </div>
      <div className="card card-pad">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="sk sk-line" key={i} style={{ width: `${95 - i * 8}%`, height: 16, marginBottom: 14 }} />
        ))}
      </div>
    </div>
  );
}