"use client";

/**
 * =====================================================================
 * BOOKING MODAL
 * ---------------------------------------------------------------------
 * Any button anywhere on the site can open this by calling
 * useBooking().open(propertyId).
 *
 * On submit the order is deliberate:
 *   1. validate,
 *   2. SAVE TO FIRESTORE,
 *   3. then offer WhatsApp.
 * WhatsApp is never the only place the booking exists.
 * =====================================================================
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WaIcon, InfoIcon } from "@/components/icons";
import { VISIT_TIMES } from "@/lib/whatsapp";
import { submitBooking } from "@/app/actions/booking";

export interface PropertyOption {
  id: string;
  title: string;
}

interface BookingContextValue {
  open: (propertyId?: string) => void;
}

const BookingContext = createContext<BookingContextValue>({ open: () => {} });

export function useBooking() {
  return useContext(BookingContext);
}

type Errors = Partial<Record<string, string>>;

export default function BookingProvider({
  properties,
  children,
}: {
  properties: PropertyOption[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ link: string } | null>(null);
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const open = useCallback((id?: string) => {
    setPropertyId(id ?? "");
    setErrors({});
    setFormError("");
    setDone(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Escape closes it, and the page behind stops scrolling while it is up.
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setFormError("");

    const data = new FormData(event.currentTarget);
    const result = await submitBooking(data);
    setPending(false);

    if (!result.ok) {
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.message) setFormError(result.message);
      return;
    }
    setDone({ link: result.whatsappLink });
  }

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}

      <div
        className={`modal${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-hidden={!isOpen}
      >
        <div className="modal-veil" onClick={close} />
        <div className="modal-box">
          <button className="modal-x" type="button" onClick={close} aria-label="Close booking form">
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </button>

          <div className="modal-head">
            <h2 id="modalTitle">{done ? "Booking received" : "Book a site visit"}</h2>
            <p>
              {done
                ? "Your request is saved with our team. Send it on WhatsApp too if you would like an instant reply."
                : "Tell us when suits you. Your request is saved with our team straight away."}
            </p>
          </div>

          <div className="modal-body">
            {done ? (
              <div>
                <p style={{ marginBottom: 22 }}>
                  Thank you. A consultant will call you to confirm the visit.
                </p>
                <a
                  className="btn btn-wa btn-block"
                  href={done.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WaIcon /> Continue on WhatsApp
                </a>
                <button
                  className="btn btn-outline btn-block"
                  type="button"
                  style={{ marginTop: 10 }}
                  onClick={close}
                >
                  Close
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                <div className="form-grid">
                  <div className={`field${errors.customerName ? " has-err" : ""}`}>
                    <label htmlFor="bkName">Full name</label>
                    <input
                      ref={firstFieldRef}
                      id="bkName"
                      name="customerName"
                      type="text"
                      autoComplete="name"
                      placeholder="Rahul Sharma"
                    />
                    <span className="err">{errors.customerName}</span>
                  </div>

                  <div className={`field${errors.phone ? " has-err" : ""}`}>
                    <label htmlFor="bkPhone">Mobile number</label>
                    <input
                      id="bkPhone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98765 43210"
                    />
                    <span className="err">{errors.phone}</span>
                  </div>

                  <div className={`field col-2${errors.email ? " has-err" : ""}`}>
                    <label htmlFor="bkEmail">
                      Email <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <input id="bkEmail" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
                    <span className="err">{errors.email}</span>
                  </div>

                  <div className={`field col-2${errors.propertyId ? " has-err" : ""}`}>
                    <label htmlFor="bkProperty">Property you&apos;re interested in</label>
                    <select
                      id="bkProperty"
                      name="propertyId"
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                    >
                      <option value="">Choose a property…</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                      <option value="general">Not sure yet — advise me</option>
                    </select>
                    <span className="err">{errors.propertyId}</span>
                  </div>

                  <div className={`field${errors.visitDate ? " has-err" : ""}`}>
                    <label htmlFor="bkDate">Preferred visit date</label>
                    <input id="bkDate" name="visitDate" type="date" min={today} />
                    <span className="err">{errors.visitDate}</span>
                  </div>

                  <div className={`field${errors.visitTime ? " has-err" : ""}`}>
                    <label htmlFor="bkTime">Preferred visit time</label>
                    <select id="bkTime" name="visitTime" defaultValue="">
                      <option value="">Choose a time…</option>
                      {VISIT_TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="err">{errors.visitTime}</span>
                  </div>

                  <div className="field col-2">
                    <label htmlFor="bkMsg">
                      Message <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <textarea id="bkMsg" name="message" placeholder="I would like to visit this property." />
                  </div>
                </div>

                {formError ? (
                  <p className="note note-err" style={{ marginTop: 18 }}>
                    {formError}
                  </p>
                ) : null}

                <button className="btn btn-gold btn-block" type="submit" style={{ marginTop: 26 }} disabled={pending}>
                  {pending ? "Saving your request…" : "Request site visit"}
                </button>

                <p className="modal-note">
                  <InfoIcon />
                  <span>
                    Your request is saved with our team first. You will then get the option to send it on
                    WhatsApp as well.
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </BookingContext.Provider>
  );
}
