"use client";

import { useState } from "react";
import { WaIcon } from "@/components/icons";
import { submitEnquiry } from "@/app/actions/enquiry";

const INTERESTS = [
  "Buying a property",
  "Selling a property",
  "Renting a property",
  "Investment guidance",
  "Plots & land",
  "Commercial property",
  "Something else",
];

/**
 * Saves the enquiry to Firestore first, then offers WhatsApp.
 * Same order as the booking form, for the same reason.
 */
export default function EnquiryForm({
  propertyId = "",
  propertyTitle,
  source = "contact-page",
}: {
  propertyId?: string;
  propertyTitle?: string;
  source?: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<{ link: string } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setFormError("");

    const result = await submitEnquiry(new FormData(event.currentTarget));
    setPending(false);

    if (!result.ok) {
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.message) setFormError(result.message);
      return;
    }
    setSent({ link: result.whatsappLink });
  }

  if (sent) {
    return (
      <div>
        <p className="note note-ok" style={{ marginBottom: 18 }}>
          Thank you — your enquiry is with our team. We reply the same working day.
        </p>
        <a className="btn btn-wa btn-block" href={sent.link} target="_blank" rel="noopener noreferrer">
          <WaIcon /> Send it on WhatsApp too
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="source" value={source} />

      <div className="form-grid">
        <div className={`field${errors.customerName ? " has-err" : ""}`}>
          <label htmlFor="cName">Full name</label>
          <input id="cName" name="customerName" type="text" autoComplete="name" placeholder="Rahul Sharma" />
          <span className="err">{errors.customerName}</span>
        </div>

        <div className={`field${errors.phone ? " has-err" : ""}`}>
          <label htmlFor="cPhone">Mobile number</label>
          <input
            id="cPhone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="98765 43210"
          />
          <span className="err">{errors.phone}</span>
        </div>

        <div className={`field col-2${errors.email ? " has-err" : ""}`}>
          <label htmlFor="cEmail">
            Email <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input id="cEmail" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          <span className="err">{errors.email}</span>
        </div>

        <div className={`field col-2${errors.propertyTitle ? " has-err" : ""}`}>
          <label htmlFor="cInterest">I&apos;m interested in</label>
          {propertyTitle ? (
            <input id="cInterest" name="propertyTitle" type="text" readOnly value={propertyTitle} />
          ) : (
            <select id="cInterest" name="propertyTitle" defaultValue={INTERESTS[0]}>
              {INTERESTS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          )}
          <span className="err">{errors.propertyTitle}</span>
        </div>

        <div className={`field col-2${errors.message ? " has-err" : ""}`}>
          <label htmlFor="cMsg">Message</label>
          <textarea id="cMsg" name="message" placeholder="Budget, preferred area, timeline…" />
          <span className="err">{errors.message}</span>
        </div>
      </div>

      {formError ? (
        <p className="note note-err" style={{ marginTop: 16 }}>
          {formError}
        </p>
      ) : null}

      <button className="btn btn-ink btn-block" type="submit" style={{ marginTop: 24 }} disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
