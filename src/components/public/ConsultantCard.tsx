import Image from "next/image";
import { WhatsAppButton } from "./ActionButtons";
import { siteConfig } from "@/config/site";

/**
 * The person behind the business. Search engines treat a named, pictured
 * human as a signal that a site belongs to a real local business rather
 * than a listings scraper — and buyers trust a face more than a form.
 *
 * The photo path is set once in src/config/site.ts.
 */
export default function ConsultantCard({ compact = false }: { compact?: boolean }) {
  const { consultant, phone } = siteConfig;

  return (
    <div className={`consultant${compact ? " is-compact" : ""}`}>
      <div className="consultant-photo">
        <Image
          src={consultant.photo}
          alt={`${consultant.name}, ${consultant.role} at ${siteConfig.brand}`}
          fill
          sizes={compact ? "120px" : "(max-width: 900px) 260px, 320px"}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="consultant-body">
        <p className="eyebrow">Who you will be dealing with</p>
        <h3 className="h-md">{consultant.name}</h3>
        <p className="consultant-role">{consultant.role}</p>
        {!compact ? <p className="lede" style={{ marginTop: 14 }}>{consultant.bio}</p> : null}

        <div className="cta-acts" style={{ justifyContent: "flex-start", marginTop: 20 }}>
          <a className="btn btn-outline btn-sm" href={`tel:${phone.replace(/\s/g, "")}`}>
            Call {phone}
          </a>
          <WhatsAppButton about="your properties" className="btn btn-wa btn-sm">
            WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}