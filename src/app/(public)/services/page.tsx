import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import CtaBand from "@/components/public/CtaBand";
import ProcessBlock from "@/components/public/ProcessBlock";
import { BookVisitButton, WhatsAppButton } from "@/components/public/ActionButtons";
import { SERVICES } from "@/config/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Buying, selling, renting, investment guidance, property consultancy, plots and land, and commercial property across Delhi NCR.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head blueprint">
        <div className="shell">
          <p className="crumbs">
            <Link href="/">Home</Link> / <span>Services</span>
          </p>
          <h1 className="h-xl">Services</h1>
          <p className="lede" style={{ color: "rgba(248,244,234,.72)" }}>
            Seven areas of work, one standard of advice. Whether you&apos;re buying your first home or placing
            capital, the process starts the same way — with a conversation about what you actually need.
          </p>
        </div>
      </section>

      <section className="band band-dark blueprint on-dark">
        <div className="shell">
          <div className="grid-svc">
            {SERVICES.map((s, i) => (
              <article className="svc reveal" data-d={i % 3} key={s.id}>
                <div className="svc-photo">
                  <Photo src={s.image} alt="" sizes="(max-width: 680px) 100vw, 33vw" />
                </div>
                <p className="svc-num">{String(i + 1).padStart(2, "0")}</p>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
                <WhatsAppButton about={s.title} className="svc-link">
                  Talk to us about {s.title.toLowerCase()}
                </WhatsAppButton>
              </article>
            ))}

            <article className="svc reveal" style={{ background: "var(--gold)", color: "var(--purple-900)" }}>
              <p className="svc-num" style={{ color: "var(--purple-900)" }}>
                —
              </p>
              <h3 style={{ color: "var(--purple-900)" }}>Something else?</h3>
              <p style={{ color: "rgba(22,10,50,.78)" }}>
                Joint development, NRI advisory, portfolio review, dispute-free title work. Ask and we&apos;ll
                tell you honestly whether we&apos;re the right people.
              </p>
              <BookVisitButton
                className="svc-link"
                children="Book a consultation"
              />
            </article>
          </div>
        </div>
      </section>

      <ProcessBlock dark={false} />
      <CtaBand />
    </>
  );
}
