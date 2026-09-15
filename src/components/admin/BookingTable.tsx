"use client";

import { useMemo, useState, useTransition } from "react";
import { changeBookingStatus, removeBooking } from "@/app/admin/actions";
import { prettyDate } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { BOOKING_STATUSES, type Booking } from "@/types";

const LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  visited: "Visited",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingTable({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState("");
  const [confirming, setConfirming] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () => (filter ? bookings.filter((b) => b.status === filter) : bookings),
    [bookings, filter]
  );

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) => {
    setError("");
    startTransition(async () => {
      const result = await fn();
      if (!result.ok && result.message) setError(result.message);
    });
  };

  return (
    <>
      {error ? <p className="note note-err">{error}</p> : null}

      <section className="card">
        <div className="card-head">
          <h2>Site visit bookings</h2>
          <div className="row-acts">
            <button className="pill" type="button" aria-pressed={filter === ""} onClick={() => setFilter("")}>
              All
            </button>
            {BOOKING_STATUSES.map((s) => (
              <button
                key={s}
                className="pill"
                type="button"
                aria-pressed={filter === s}
                onClick={() => setFilter(s)}
              >
                {LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {rows.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Visit date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="tbl-title">{b.customerName}</span>
                      {b.email ? <span className="tbl-sub">{b.email}</span> : null}
                      {b.message ? <span className="tbl-sub">“{b.message}”</span> : null}
                    </td>
                    <td>
                      <a href={`tel:${b.phone}`}>{b.phone}</a>
                    </td>
                    <td className="tbl-sub">{b.propertyTitle}</td>
                    <td>{prettyDate(b.visitDate)}</td>
                    <td className="tbl-sub">{b.visitTime}</td>
                    <td>
                      <select
                        className="mini"
                        value={b.status}
                        disabled={pending}
                        onChange={(e) => run(() => changeBookingStatus(b.id, e.target.value))}
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="tbl-sub">{prettyDate(b.createdAt.slice(0, 10))}</td>
                    <td>
                      <div className="row-acts">
                        <a
                          className="btn-mini"
                          href={whatsappLink(
                            `Hello ${b.customerName}, this is KEY2RAJ Real Estate about your site visit for ${b.propertyTitle}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                        <button className="btn-mini is-danger" type="button" onClick={() => setConfirming(b)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="blank">
            <b>No bookings yet</b>
            <span>Site visit requests from the website will appear here.</span>
          </div>
        )}
      </section>

      {confirming ? (
        <div className="dlg" role="dialog" aria-modal="true">
          <div className="dlg-veil" onClick={() => setConfirming(null)} />
          <div className="dlg-box">
            <h3>Delete booking?</h3>
            <p>
              The request from <strong>{confirming.customerName}</strong> will be removed. This action cannot
              be undone.
            </p>
            <div className="dlg-acts">
              <button className="btn btn-outline btn-sm" type="button" onClick={() => setConfirming(null)}>
                Cancel
              </button>
              <button
                className="btn btn-sm"
                type="button"
                style={{ background: "#B3261E", color: "#fff", borderColor: "#B3261E" }}
                onClick={() => {
                  const id = confirming.id;
                  setConfirming(null);
                  run(() => removeBooking(id));
                }}
              >
                Delete booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
