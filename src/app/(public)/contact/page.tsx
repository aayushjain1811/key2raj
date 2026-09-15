import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/public/EnquiryForm";
import { OfficeMap } from "@/components/public/MapEmbed";
import ConsultantCard from "@/components/public/ConsultantCard";
import { BookVisitButton, WhatsAppButton } from "@/components/public/ActionButtons";
import { PhoneIcon, MailIcon, PinOutline, ClockIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call, write or WhatsApp ${siteConfig.brand} ${siteConfig.brandLine}. Office in Gurugram, open six days a week.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head blueprint">
        <div className="shell">
          <p className="crumbs">
            <Link href="/">Home</Link> / <span>Contact</span>
          </p>
          <h1 className="h-xl">Contact</h1>
          <p className="lede" style={{ color: "rgba(248,244,234,.72)" }}>
            Call, write, or send the brief on WhatsApp. Someone from the team replies the same working day.
          </p>
        </div>
      </section>

      <section className="band band-deep blueprint on-dark">
        <div className="shell contact-grid">
          <div className="reveal">
            <p className="eyebrow">Reach us</p>
            <h2 className="h-lg">
              The office is open
              <br />
              six days a week
            </h2>
            <ul className="info-list">
              <li>
                <PhoneIcon />
                <div>
                  <b>Phone</b>
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
                </div>
              </li>
              <li>
                <MailIcon />
                <div>
                  <b>Email</b>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </div>
              </li>
              <li>
                <PinOutline />
                <div>
                  <b>Office</b>
                  <span style={{ whiteSpace: "pre-line" }}>{siteConfig.address}</span>
                </div>
              </li>
              <li>
                <ClockIcon />
                <div>
                  <b>Hours</b>
                  <span>{siteConfig.hours}</span>
                </div>
              </li>
            </ul>
            <div className="cta-acts" style={{ justifyContent: "flex-start", marginTop: 30 }}>
              <WhatsAppButton about="your services" className="btn btn-wa">
                WhatsApp us
              </WhatsAppButton>
              <BookVisitButton className="btn btn-ghost" />
            </div>
          </div>

          <div className="form-card reveal" data-d="1">
            <h3 className="h-md" style={{ marginBottom: 8 }}>
              Send an enquiry
            </h3>
            <p style={{ fontSize: "14.5px", color: "var(--ink-soft)", marginBottom: 24 }}>
              Fill this in and it reaches our team straight away. You can send it on WhatsApp too.
            </p>
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section className="band-tight band-white">
        <div className="shell">
          <ConsultantCard compact />
        </div>
      </section>

      <section className="band-tight band-ivory">
        <div className="shell">
          <OfficeMap />
        </div>
      </section>
    </>
  );
}