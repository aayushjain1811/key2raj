import { PROCESS_STEPS } from "@/config/site";

export default function ProcessBlock({ dark = true }: { dark?: boolean }) {
  return (
    <section className={`band ${dark ? "band-deep blueprint on-dark" : "band-white"}`}>
      <div className="shell">
        <div className="head-split">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="h-lg">Four steps, in this order</h2>
          </div>
          <p className="lede" style={{ maxWidth: "38ch" }}>
            Most of the value is in the first step. Everything after it is execution.
          </p>
        </div>
        <div className="stats">
          {PROCESS_STEPS.map(([title, detail], i) => (
            <div
              className="stat reveal"
              data-d={i}
              key={title}
              style={{ textAlign: "left", padding: "34px 28px" }}
            >
              <b style={{ fontSize: 15, letterSpacing: ".2em" }}>0{i + 1}</b>
              <b style={{ fontSize: 24, color: "var(--ivory)", marginTop: 14 }}>{title}</b>
              <span
                style={{
                  textTransform: "none",
                  letterSpacing: ".01em",
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  display: "block",
                  marginTop: 10,
                }}
              >
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
