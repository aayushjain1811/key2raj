/**
 * Shown while a public page is being prepared on the server.
 * It mirrors the shape of a listing page — page head, then cards — so
 * the layout does not jump when the real content arrives.
 */
export default function Loading() {
  return (
    <>
      <section className="page-head blueprint">
        <div className="shell">
          <div className="sk sk-line" style={{ width: 140, height: 12 }} />
          <div className="sk sk-line" style={{ width: "min(420px, 70%)", height: 46, marginTop: 20 }} />
          <div className="sk sk-line" style={{ width: "min(560px, 90%)", height: 14, marginTop: 20 }} />
        </div>
      </section>

      <section className="band-tight band-ivory">
        <div className="shell">
          <div className="grid-props">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <article className="pcard" key={i}>
                <div className="sk" style={{ aspectRatio: "4/3" }} />
                <div className="pcard-body">
                  <div className="sk sk-line" style={{ width: 90, height: 10 }} />
                  <div className="sk sk-line" style={{ width: "75%", height: 22, marginTop: 12 }} />
                  <div className="sk sk-line" style={{ width: "55%", height: 12, marginTop: 12 }} />
                  <div className="sk sk-line" style={{ width: "100%", height: 52, marginTop: 20 }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}