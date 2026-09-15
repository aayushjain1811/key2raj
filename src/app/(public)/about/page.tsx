import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import CtaBand from "@/components/public/CtaBand";
import ProcessBlock from "@/components/public/ProcessBlock";
import ConsultantCard from "@/components/public/ConsultantCard";
import { TickIcon } from "@/components/icons";
import { IMG, STATS, WHY_POINTS, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "KEY2RAJ Real Estate — a property consultancy built on verification, paperwork and honest advice across Delhi NCR.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-head blueprint">
        <div className="shell">
          <p className="crumbs">
            <Link href="/">Home</Link> / <span>About</span>
          </p>
          <h1 className="h-xl">About {siteConfig.brand}</h1>
          <p className="lede" style={{ color: "rgba(248,244,234,.72)" }}>
            A property consultancy built on the unglamorous parts of the business — verification, paperwork,
            and telling clients when to walk away.
          </p>
        </div>
      </section>

      <section className="band band-ivory">
        <div className="shell split">
          <div className="reveal">
            <p className="eyebrow">Our story</p>
            <h2 className="h-lg">
              Started with one flat
              <br />
              in Sector 49
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {siteConfig.brand} began in 2008 with a single resale flat and a founder who kept getting asked
              the same question by friends: is this a good buy? Eighteen years later that is still the
              question, and answering it properly is still the whole business.
            </p>
            <p style={{ marginTop: 16, maxWidth: "60ch" }}>
              We work across Gurugram, Noida, Faridabad and four other NCR markets. We hold no exclusive
              tie-ups with builders, which means when we recommend a project it is because it stands up, not
              because it pays better. Every listing on this site is visited before it is published, and every
              file is checked for title, approvals and encumbrance before a client signs anything.
            </p>
            <div className="cta-acts" style={{ justifyContent: "flex-start", marginTop: 30 }}>
              <Link className="btn btn-ink" href="/properties">
                See our listings
              </Link>
              <Link className="btn btn-outline" href="/contact">
                Visit the office
              </Link>
            </div>
          </div>
          <div className="split-media is-flip reveal" data-d="1">
            <Photo
              src={IMG.consult}
              alt="Property consultant reviewing plans with clients"
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="shell">
          <ConsultantCard />
        </div>
      </section>

      <section className="band-tight band-deep">
        <div className="shell">
          <div className="stats">
            {STATS.map(([value, label]) => (
              <div className="stat reveal" key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="shell">
          <div className="head-center">
            <p className="eyebrow is-center">Why {siteConfig.brand}</p>
            <h2 className="h-lg">What you get from working with us</h2>
          </div>
          <div className="split">
            <ul className="why-list reveal" style={{ margin: 0 }}>
              {WHY_POINTS.slice(0, 3).map(([title, detail]) => (
                <li key={title}>
                  <TickIcon />
                  <div>
                    <b>{title}</b>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <ul className="why-list reveal" data-d="1" style={{ margin: 0 }}>
              {WHY_POINTS.slice(3).map(([title, detail]) => (
                <li key={title}>
                  <TickIcon />
                  <div>
                    <b>{title}</b>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProcessBlock dark />
      <CtaBand />
    </>
  );
}