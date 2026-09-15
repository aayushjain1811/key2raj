import Photo from "@/components/Photo";
import { BookVisitButton, WhatsAppButton } from "./ActionButtons";
import { IMG } from "@/config/site";

export default function CtaBand() {
  return (
    <section className="band cta-band">
      <div className="cta-photo">
        <Photo src={IMG.dusk} alt="" sizes="100vw" />
      </div>
      <div className="shell">
        <p className="eyebrow is-center">Talk to a consultant</p>
        <h2 className="h-lg" style={{ color: "var(--ivory)", maxWidth: "16ch", marginInline: "auto" }}>
          Tell us what you&apos;re looking for
        </h2>
        <p
          className="lede"
          style={{ color: "rgba(248,244,234,.75)", margin: "20px auto 0", textAlign: "center" }}
        >
          Send us the brief — budget, area, timeline — and we&apos;ll come back with a shortlist worth your
          Saturday.
        </p>
        <div className="cta-acts">
          <BookVisitButton className="btn btn-gold" />
          <WhatsAppButton about="a property" className="btn btn-ghost">
            Message on WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
