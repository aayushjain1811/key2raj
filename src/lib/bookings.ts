/** Booking data access. Server only. */
import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Booking, BookingStatus } from "@/types";
import type { BookingInput } from "@/lib/validations/booking";

const COLLECTION = "bookings";

function toBooking(id: string, data: FirebaseFirestore.DocumentData): Booking {
  const asIso = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : typeof v === "string" ? v : "";
  return {
    id,
    propertyId: data.propertyId ?? "",
    propertyTitle: data.propertyTitle ?? "",
    customerName: data.customerName ?? "",
    phone: data.phone ?? "",
    email: data.email ?? "",
    visitDate: data.visitDate ?? "",
    visitTime: data.visitTime ?? "",
    message: data.message ?? "",
    status: data.status ?? "new",
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  };
}

export async function createBooking(input: BookingInput): Promise<string> {
  const now = Timestamp.now();
  const ref = await adminDb().collection(COLLECTION).add({
    ...input,
    status: "new" as BookingStatus,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function getAllBookings(): Promise<Booking[]> {
  const snap = await adminDb().collection(COLLECTION).get();
  return snap.docs
    .map((d) => toBooking(d.id, d.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).update({ status, updatedAt: Timestamp.now() });
}

export async function deleteBooking(id: string): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).delete();
}
