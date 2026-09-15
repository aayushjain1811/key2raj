"use client";

import { useMemo, useState, useTransition } from "react";
import { changeEnquiryStatus, removeEnquiry } from "@/app/admin/actions";
import { prettyDate } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { ENQUIRY_STATUSES, type Enquiry } from "@/types";

const LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export default function EnquiryTable({ enquiries }: { enquiries: Enquiry[] }) {
  const [filter, setFilter] = useState("");
  const [confirming, setConfirming] = useState<Enquiry | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () => (filter ? enquiries.filter((e) => e.status === filter) : enquiries),
    [enquiries, filter]
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
          <h2>Enquiries</h2>
          <div className="row-acts">
            <button className="pill" type="button" aria-pressed={filter === ""} onClick={() => setFilter("")}>
              All
            </button>
            {ENQUIRY_STATUSES.map((s) => (
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
                  <th>Interested in</th>
                  <th>Message</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span className="tbl-title">{e.customerName}</span>
                      {e.email ? <span className="tbl-sub">{e.email}</span> : null}
                    </td>
                    <td>
                      <a href={`tel:${e.phone}`}>{e.phone}</a>
                    </td>
                    <td className="tbl-sub">{e.propertyTitle}</td>
                    <td className="tbl-sub" style={{ maxWidth: 280 }}>
                      {e.message}
                    </td>
                    <td className="tbl-sub">{e.source}</td>
                    <td>
                      <select
                        className="mini"
                        value={e.status}
                        disabled={pending}
                        onChange={(event) => run(() => changeEnquiryStatus(e.id, event.target.value))}
                      >
                        {ENQUIRY_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="tbl-sub">{prettyDate(e.createdAt.slice(0, 10))}</td>
                    <td>
                      <div className="row-acts">
                        <a
                          className="btn-mini"
                          href={whatsappLink(
                            `Hello ${e.customerName}, this is KEY2RAJ Real Estate replying to your enquiry.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                        <button className="btn-mini is-danger" type="button" onClick={() => setConfirming(e)}>
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
            <b>No enquiries yet</b>
            <span>Messages from the contact page will appear here.</span>
          </div>
        )}
      </section>

      {confirming ? (
        <div className="dlg" role="dialog" aria-modal="true">
          <div className="dlg-veil" onClick={() => setConfirming(null)} />
          <div className="dlg-box">
            <h3>Delete enquiry?</h3>
            <p>
              The message from <strong>{confirming.customerName}</strong> will be removed. This action cannot
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
                  run(() => removeEnquiry(id));
                }}
              >
                Delete enquiry
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
