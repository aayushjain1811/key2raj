"use client";

/**
 * Uploads property videos straight from this browser to Firebase
 * Storage, skipping our own server entirely.
 *
 * Photos go through /api/admin/upload because they are small. Videos
 * cannot: most hosts cap the size of a request body at around 4.5 MB,
 * so a 40 MB walkthrough would be rejected before it arrived. Firebase
 * checks the admin claim on the account before allowing the write.
 */
import { useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getClientAuth, getClientStorage } from "@/lib/firebase/client";
import type { PropertyVideo } from "@/types";

/**
 * Firebase restores the signed-in user from browser storage, and that
 * takes a moment. Uploading before it finishes means Storage sees no
 * user at all and refuses the write. This waits for the answer, then
 * forces a token refresh so the admin claim is definitely in it — the
 * claim is added after the account is created, and an old token in the
 * browser will not have it.
 */
async function currentFirebaseUser(): Promise<User | null> {
  const auth = getClientAuth();
  const user =
    auth.currentUser ??
    (await new Promise<User | null>((resolve) => {
      const stop = onAuthStateChanged(auth, (u) => {
        stop();
        resolve(u);
      });
    }));

  if (user) await user.getIdToken(true);
  return user;
}

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_VIDEOS = 4;
const ALLOWED = ["video/mp4", "video/webm", "video/quicktime"];

export default function VideoUploader({
  propertyId,
  videos,
  onChange,
}: {
  propertyId: string;
  videos: PropertyVideo[];
  onChange: (next: PropertyVideo[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const renumber = (list: PropertyVideo[]) =>
    list.map((video, i) => ({ ...video, sortOrder: i }));

  async function uploadOne(file: File) {
    if (!ALLOWED.includes(file.type)) {
      setError("Only MP4, WebM or MOV videos are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`That video is ${Math.round(file.size / 1024 / 1024)} MB. The limit is 100 MB.`);
      return;
    }
    if (videos.length >= MAX_VIDEOS) {
      setError(`You can add up to ${MAX_VIDEOS} videos per property.`);
      return;
    }

    setBusy(true);
    setError("");
    setProgress(0);

    const user = await currentFirebaseUser();
    if (!user) {
      setError("Your Firebase session has expired. Log out and sign in again, then retry.");
      setBusy(false);
      return;
    }

    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const path = `properties/${propertyId || "unassigned"}/videos/${id}.${extension}`;

    try {
      const task = uploadBytesResumable(storageRef(getClientStorage(), path), file, {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          reject,
          resolve
        );
      });

      const url = await getDownloadURL(task.snapshot.ref);
      onChange(
        renumber([
          ...videos,
          { id, url, storagePath: path, name: file.name, sortOrder: videos.length },
        ])
      );
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code === "storage/unauthorized"
          ? "Firebase refused the upload. Publish the updated storage.rules in the Firebase console, then log out and sign in again."
          : "Upload failed. Check your connection and try again."
      );
      console.error("Video upload failed:", err);
    }

    setBusy(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function removeVideo(video: PropertyVideo) {
    onChange(renumber(videos.filter((v) => v.id !== video.id)));
    if (video.storagePath) {
      try {
        await deleteObject(storageRef(getClientStorage(), video.storagePath));
      } catch {
        // Already gone is not worth reporting.
      }
    }
  }

  function move(index: number, by: number) {
    const next = [...videos];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(renumber(next));
  }

  return (
    <div>
      <div className="upl">
        <p style={{ marginBottom: 12 }}>
          A short walkthrough sells a property better than any photograph.
        </p>
        <button
          className="btn btn-outline btn-sm"
          type="button"
          disabled={busy || videos.length >= MAX_VIDEOS}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? `Uploading… ${progress}%` : "Choose a video"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => e.target.files?.[0] && uploadOne(e.target.files[0])}
        />
        <p className="hint" style={{ marginTop: 10 }}>
          MP4, WebM or MOV · up to 100 MB · {MAX_VIDEOS} videos maximum
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

      {videos.length ? (
        <div className="vid-list">
          {videos.map((video, index) => (
            <div className="vid-row" key={video.id}>
              <video src={video.url} preload="metadata" muted playsInline />
              <div className="vid-meta">
                <b>{video.name || `Video ${index + 1}`}</b>
                <span className="hint">{index === 0 ? "Shown first" : `Position ${index + 1}`}</span>
              </div>
              <div className="row-acts">
                <button className="btn-mini" type="button" onClick={() => move(index, -1)}>
                  ↑
                </button>
                <button className="btn-mini" type="button" onClick={() => move(index, 1)}>
                  ↓
                </button>
                <button className="btn-mini is-danger" type="button" onClick={() => removeVideo(video)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}