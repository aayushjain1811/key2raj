"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Every photograph on the site goes through here.
 * If an image fails to load, an architectural KEY2RAJ panel takes its
 * place, so the layout never breaks while photos are being swapped.
 * The parent element must be position:relative — the image fills it.
 */
export const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
     <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#24104F"/><stop offset="1" stop-color="#160A32"/>
     </linearGradient></defs>
     <rect width="800" height="600" fill="url(#g)"/>
     <g fill="none" stroke="#C9A227" stroke-opacity=".45" stroke-width="1.2">
       <rect x="150" y="250" width="120" height="290"/><rect x="300" y="170" width="150" height="370"/>
       <rect x="480" y="300" width="110" height="240"/><rect x="620" y="220" width="90" height="320"/>
       <path d="M60 540h700"/>
       <path d="M320 210h110M320 250h110M320 290h110M320 330h110M320 370h110M320 410h110M320 450h110"/>
       <path d="M170 290h80M170 330h80M170 370h80M170 410h80M170 450h80"/>
     </g>
     <text x="400" y="120" fill="#E2C66D" font-family="Georgia,serif" font-size="30"
       letter-spacing="7" text-anchor="middle">KEY2RAJ</text>
   </svg>`
  );

interface PhotoProps {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

export default function Photo({ src, alt, priority = false, sizes = "100vw" }: PhotoProps) {
  const [current, setCurrent] = useState(src && src.length > 0 ? src : FALLBACK);
  const isFallback = current === FALLBACK;

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized={isFallback}
      onError={() => setCurrent(FALLBACK)}
      style={{ objectFit: "cover" }}
    />
  );
}
