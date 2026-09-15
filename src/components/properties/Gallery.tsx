"use client";

import { useState } from "react";
import Photo from "@/components/Photo";
import type { PropertyImage } from "@/types";

/** Property photo gallery: one large image, thumbnails, arrows, counter. */
export default function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const safe = images.length ? images : [{ id: "none", url: "", storagePath: "", isFeatured: true, sortOrder: 0 }];
  const current = safe[Math.min(index, safe.length - 1)];

  const step = (by: number) => setIndex((i) => (i + by + safe.length) % safe.length);

  return (
    <div className="gallery">
      <div className="gal-main">
        <Photo
          key={current.id}
          src={current.url}
          alt={`${title} — photograph ${index + 1}`}
          priority
          sizes="(max-width: 1080px) 100vw, 66vw"
        />
        {safe.length > 1 ? (
          <>
            <button className="gal-nav gal-prev" type="button" onClick={() => step(-1)} aria-label="Previous photo">
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                <path d="M11 1L2 10l9 9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button className="gal-nav gal-next" type="button" onClick={() => step(1)} aria-label="Next photo">
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                <path d="M1 1l9 9-9 9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </>
        ) : null}
        <span className="gal-count">
          {index + 1} / {safe.length}
        </span>
      </div>

      {safe.length > 1 ? (
        <div className="gal-thumbs">
          {safe.map((img, i) => (
            <button
              key={img.id}
              className="gal-thumb"
              type="button"
              aria-current={i === index}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <Photo src={img.url} alt={`${title} photo ${i + 1}`} sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
