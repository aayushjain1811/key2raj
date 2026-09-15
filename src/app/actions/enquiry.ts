"use server";

/** Public server action for the contact / enquiry form. */
import { enquirySchema } from "@/lib/validations/enquiry";
import { createEnquiry } from "@/lib/enquiries";
import { enquiryMessage, whatsappLink } from "@/lib/whatsapp";

export type EnquiryResult =
  | { ok: true; whatsappLink: string }
  | { ok: false; fieldErrors?: Record<string, string>; message?: string };

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse({
    propertyId: formData.get("propertyId") ?? "",
    propertyTitle: formData.get("propertyTitle") ?? "",
    customerName: formData.get("customerName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    source: formData.get("source") ?? "contact-page",
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
    await createEnquiry(parsed.data);
  } catch (error) {
    console.error("Enquiry save failed:", error);
    return { ok: false, message: "We could not send your message. Please try again, or call us." };
  }

  return { ok: true, whatsappLink: whatsappLink(enquiryMessage(parsed.data)) };
}
