/**
 * =====================================================================
 * PROPERTY DATA ACCESS
 * ---------------------------------------------------------------------
 * Every read and write of the properties collection goes through this
 * file. Pages never talk to Firestore directly, so if the data model
 * changes, only this file changes.
 * Runs on the server only — it uses the Admin SDK.
 * =====================================================================
 */
import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminBucket } from "@/lib/firebase/admin";
import type { Property, PropertyStatus } from "@/types";
import type { PropertyInput } from "@/lib/validations/property";

const COLLECTION = "properties";

/**
 * Firestore gives back Timestamps and untyped objects. This turns one
 * document into the clean Property shape the rest of the app expects.
 */
function toProperty(id: string, data: FirebaseFirestore.DocumentData): Property {
  const asIso = (v: unknown): string => {
    if (v instanceof Timestamp) return v.toDate().toISOString();
    if (typeof v === "string") return v;
    return new Date().toISOString();
  };

  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    propertyType: data.propertyType ?? "apartment",
    purpose: data.purpose ?? "buy",
    status: data.status ?? "available",
    possession: data.possession ?? "",
    price: Number(data.price ?? 0),
    location: data.location ?? "",
    city: data.city ?? "",
    address: data.address ?? "",
    bedrooms: Number(data.bedrooms ?? 0),
    bathrooms: Number(data.bathrooms ?? 0),
    area: Number(data.area ?? 0),
    areaUnit: data.areaUnit ?? "sq.ft.",
    parking: data.parking ?? "",
    facing: data.facing ?? "",
    floor: data.floor ?? "",
    summary: data.summary ?? "",
    description: data.description ?? "",
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    agentName: data.agentName ?? "",
    agentRole: data.agentRole ?? "",
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    images: Array.isArray(data.images)
      ? [...data.images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      : [],
    videos: Array.isArray(data.videos)
      ? [...data.videos].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      : [],
    videoEmbedUrl: data.videoEmbedUrl ?? "",
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  };
}

const newestFirst = (a: Property, b: Property) => b.createdAt.localeCompare(a.createdAt);

/* ------------------------------------------------------------------ */
/* READS                                                               */
/* ------------------------------------------------------------------ */

/** Public listing. Unpublished properties never leave this function. */
export async function getPublishedProperties(): Promise<Property[]> {
  const snap = await adminDb().collection(COLLECTION).where("published", "==", true).get();
  return snap.docs.map((d) => toProperty(d.id, d.data())).sort(newestFirst);
}

export async function getFeaturedProperties(max = 6): Promise<Property[]> {
  const all = await getPublishedProperties();
  return all.filter((p) => p.featured).slice(0, max);
}

/** Public property page. Returns null for missing or unpublished. */
export async function getPublishedPropertyBySlug(slug: string): Promise<Property | null> {
  const snap = await adminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const property = toProperty(snap.docs[0].id, snap.docs[0].data());
  return property.published ? property : null;
}

/** Admin listing — includes unpublished. */
export async function getAllProperties(): Promise<Property[]> {
  const snap = await adminDb().collection(COLLECTION).get();
  return snap.docs.map((d) => toProperty(d.id, d.data())).sort(newestFirst);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const doc = await adminDb().collection(COLLECTION).doc(id).get();
  return doc.exists ? toProperty(doc.id, doc.data()!) : null;
}

/** True if the slug is free (ignoring the property being edited). */
export async function isSlugAvailable(slug: string, exceptId?: string): Promise<boolean> {
  const snap = await adminDb().collection(COLLECTION).where("slug", "==", slug).get();
  return snap.docs.every((d) => d.id === exceptId);
}

/* ------------------------------------------------------------------ */
/* WRITES                                                              */
/* ------------------------------------------------------------------ */

export async function createProperty(input: PropertyInput): Promise<string> {
  const now = Timestamp.now();
  const ref = await adminDb().collection(COLLECTION).add({
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<void> {
  await adminDb()
    .collection(COLLECTION)
    .doc(id)
    .update({ ...input, updatedAt: Timestamp.now() });
}

/** Deletes the document AND the photos and videos it owns in Storage. */
export async function deleteProperty(id: string): Promise<void> {
  const property = await getPropertyById(id);
  if (property) {
    const paths = [
      ...property.images.map((img) => img.storagePath),
      ...property.videos.map((video) => video.storagePath),
    ].filter(Boolean);

    await Promise.allSettled(paths.map((path) => adminBucket().file(path).delete()));
  }
  await adminDb().collection(COLLECTION).doc(id).delete();
}

export async function setPropertyFlag(
  id: string,
  field: "featured" | "published",
  value: boolean
): Promise<void> {
  await adminDb()
    .collection(COLLECTION)
    .doc(id)
    .update({ [field]: value, updatedAt: Timestamp.now() });
}

export async function setPropertyStatus(id: string, status: PropertyStatus): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).update({ status, updatedAt: Timestamp.now() });
}