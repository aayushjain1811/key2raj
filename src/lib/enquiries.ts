/** Enquiry data access. Server only. */
import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Enquiry, EnquiryStatus } from "@/types";
import type { EnquiryInput } from "@/lib/validations/enquiry";

const COLLECTION = "enquiries";

function toEnquiry(id: string, data: FirebaseFirestore.DocumentData): Enquiry {
  const asIso = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : typeof v === "string" ? v : "";
  return {
    id,
    propertyId: data.propertyId ?? "",
    propertyTitle: data.propertyTitle ?? "",
    customerName: data.customerName ?? "",
    phone: data.phone ?? "",
    email: data.email ?? "",
    message: data.message ?? "",
    source: data.source ?? "",
    status: data.status ?? "new",
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  };
}

export async function createEnquiry(input: EnquiryInput): Promise<string> {
  const now = Timestamp.now();
  const ref = await adminDb().collection(COLLECTION).add({
    ...input,
    status: "new" as EnquiryStatus,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  const snap = await adminDb().collection(COLLECTION).get();
  return snap.docs
    .map((d) => toEnquiry(d.id, d.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).update({ status, updatedAt: Timestamp.now() });
}

export async function deleteEnquiry(id: string): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).delete();
}
