"use server";

/**
 * Public server action for the "Book a site visit" form.
 * Runs on the server, so the browser never touches Firestore directly.
 */
import { bookingSchema } from "@/lib/validations/booking";
import { createBooking } from "@/lib/bookings";
import { getPropertyById } from "@/lib/properties";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";

export type BookingResult =
  | { ok: true; whatsappLink: string }
  | { ok: false; fieldErrors?: Record<string, string>; message?: string };

export async function submitBooking(formData: FormData): Promise<BookingResult> {
  const propertyId = String(formData.get("propertyId") ?? "");

  // Look the title up on the server so a visitor cannot fake it.
  let propertyTitle = "General enquiry";
  if (propertyId && propertyId !== "general") {
    const property = await getPropertyById(propertyId);
    if (!property || !property.published) {
      return { ok: false, fieldErrors: { propertyId: "That property is no longer available" } };
    }
    propertyTitle = property.title;
  }

  const parsed = bookingSchema.safeParse({
    propertyId,
    propertyTitle,
    customerName: formData.get("customerName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    visitDate: formData.get("visitDate") ?? "",
    visitTime: formData.get("visitTime") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  try {
    // 1. Saved to Firestore FIRST. WhatsApp is a convenience, not storage.
    await createBooking(parsed.data);
  } catch (error) {
    console.error("Booking save failed:", error);
    return { ok: false, message: "We could not save your request. Please try again, or call us." };
  }

  // 2. Only now build the WhatsApp link.
  const link = whatsappLink(bookingMessage(parsed.data));
  return { ok: true, whatsappLink: link };
}
