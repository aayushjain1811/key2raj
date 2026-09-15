"use client";

import { useState } from "react";
import type { PropertyVideo } from "@/types";

/**
 * The video block on a property page. Handles both uploaded files and
 * a pasted YouTube / Vimeo link. Nothing is downloaded until the
 * visitor presses play — `preload="metadata"` fetches only enough to
 * show the first frame and the duration.
 */
export default function VideoSection({
  videos,
  embedUrl,
  title,
  poster,
}: {
  videos: PropertyVideo[];
  embedUrl: string;
  title: string;
  poster?: string;
}) {
  const [index, setIndex] = useState(0);

  if (!videos.length && !embedUrl) return null;

  const current = videos[Math.min(index, videos.length - 1)];

  return (
    <>
      <hr className="rule-gold" style={{ margin: "38px 0" }} />
      <p className="sub">Video</p>

      {current ? (
        <>
          <div className="vid-frame">
            <video
              key={current.id}
              src={current.url}
              poster={poster}
              controls
              preload="metadata"
              playsInline
              aria-label={`${title} walkthrough video`}
            />
          </div>

          {videos.length > 1 ? (
            <div className="vid-tabs">
              {videos.map((video, i) => (
                <button
                  key={video.id}
                  className="pill"
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                >
                  Video {i + 1}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {embedUrl ? (
        <div className="vid-frame" style={{ marginTop: current ? 16 : 0 }}>
          <iframe
            src={embedUrl}
            title={`${title} video`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
    </>
  );
}