/**
 * Image upload and delete, admin only.
 *
 * The browser never talks to Firebase Storage directly. It posts the
 * file here, the server checks the session, then writes the file with
 * the Admin SDK. That means Storage rules can deny all client access.
 */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminBucket } from "@/lib/firebase/admin";

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const propertyId = String(formData.get("propertyId") ?? "unassigned");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP or AVIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That image is larger than 6 MB." }, { status: 400 });
  }

  const imageId = randomUUID();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `properties/${propertyId}/images/${imageId}.${extension}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const target = adminBucket().file(storagePath);
    await target.save(buffer, {
      contentType: file.type,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
    await target.makePublic();

    const url = `https://storage.googleapis.com/${adminBucket().name}/${encodeURI(storagePath)}`;
    return NextResponse.json({ id: imageId, url, storagePath });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const { storagePath } = await request.json().catch(() => ({ storagePath: "" }));
  if (!storagePath || !String(storagePath).startsWith("properties/")) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  try {
    await adminBucket().file(String(storagePath)).delete();
  } catch (error) {
    // Already gone is not a failure worth showing the admin.
    console.warn("Could not delete file:", error);
  }
  return NextResponse.json({ ok: true });
}
