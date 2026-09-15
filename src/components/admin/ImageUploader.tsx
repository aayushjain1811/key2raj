"use client";

import { useRef, useState } from "react";
import type { PropertyImage } from "@/types";

/**
 * Uploads photos to Firebase Storage through our own API route, then
 * keeps the metadata (url, storagePath, order, which one is featured)
 * in React state. The metadata is what gets saved on the property.
 */
export default function ImageUploader({
  propertyId,
  images,
  onChange,
}: {
  propertyId: string;
  images: PropertyImage[];
  onChange: (next: PropertyImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  /** Keeps sortOrder tidy and guarantees exactly one featured image. */
  const normalise = (list: PropertyImage[]): PropertyImage[] =>
    list.map((img, i) => ({ ...img, sortOrder: i, isFeatured: i === 0 ? true : false }));

  async function uploadFiles(files: FileList | File[]) {
    const chosen = Array.from(files);
    if (!chosen.length) return;

    setBusy(true);
    setError("");
    setProgress(0);

    const uploaded: PropertyImage[] = [];
    for (let i = 0; i < chosen.length; i++) {
      const body = new FormData();
      body.append("file", chosen[i]);
      body.append("propertyId", propertyId || "unassigned");

      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Upload failed.");
          break;
        }
        uploaded.push({
          id: data.id,
          url: data.url,
          storagePath: data.storagePath,
          isFeatured: false,
          sortOrder: images.length + uploaded.length,
        });
      } catch {
        setError("Upload failed. Check your connection and try again.");
        break;
      }
      setProgress(Math.round(((i + 1) / chosen.length) * 100));
    }

    if (uploaded.length) onChange(normalise([...images, ...uploaded]));
    setBusy(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function removeImage(image: PropertyImage) {
    onChange(normalise(images.filter((i) => i.id !== image.id)));
    if (image.storagePath) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath: image.storagePath }),
      }).catch(() => undefined);
    }
  }

  function move(index: number, by: number) {
    const next = [...images];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(normalise(next));
  }

  function makeFeatured(index: number) {
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange(normalise([picked, ...next]));
  }

  return (
    <div>
      <div
        className={`upl${dragging ? " is-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
      >
        <p style={{ marginBottom: 12 }}>
          Drag photographs here, or choose files. The first image is the featured one.
        </p>
        <button
          className="btn btn-outline btn-sm"
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Choose images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <p className="hint" style={{ marginTop: 10 }}>
          JPG, PNG, WebP or AVIF · up to 6 MB each
        </p>

        {busy ? (
          <div className="progress">
            <i style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="note note-err" style={{ marginTop: 12 }}>
          {error}
        </p>
      ) : null}

      {images.length ? (
        <div className="upl-grid">
          {images.map((image, index) => (
            <div className={`upl-item${image.isFeatured ? " is-featured" : ""}`} key={image.id}>
              {image.isFeatured ? <span className="upl-flag">Featured</span> : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={`Property photo ${index + 1}`} />
              <div className="upl-bar">
                <button className="btn-mini" type="button" onClick={() => move(index, -1)} aria-label="Move left">
                  ←
                </button>
                <button className="btn-mini" type="button" onClick={() => move(index, 1)} aria-label="Move right">
                  →
                </button>
                {!image.isFeatured ? (
                  <button className="btn-mini" type="button" onClick={() => makeFeatured(index)}>
                    Feature
                  </button>
                ) : null}
                <button className="btn-mini is-danger" type="button" onClick={() => removeImage(image)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>
          No photographs yet. A property looks unfinished without at least three.
        </p>
      )}
    </div>
  );
}
