"use server";

/**
 * =====================================================================
 * ADMIN SERVER ACTIONS
 * ---------------------------------------------------------------------
 * Every function here calls requireAdmin() first. That check happens on
 * the server, so hiding a button in the UI is never what protects data.
 *
 * revalidatePath() is what makes the public site update the moment a
 * property changes — without it, Next.js would keep serving the cached
 * page and your SOLD badge would not appear for visitors.
 * =====================================================================
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { propertySchema } from "@/lib/validations/property";
import { bookingStatusSchema } from "@/lib/validations/booking";
import { enquiryStatusSchema } from "@/lib/validations/enquiry";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  isSlugAvailable,
  setPropertyFlag,
  setPropertyStatus,
  getPropertyById,
} from "@/lib/properties";
import { setBookingStatus, deleteBooking } from "@/lib/bookings";
import { setEnquiryStatus, deleteEnquiry } from "@/lib/enquiries";
import type { PropertyStatus } from "@/types";

export type ActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Clears the cache for every page that can show a property. */
function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/properties");
  if (slug) revalidatePath(`/properties/${slug}`);
  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
}

function collectErrors(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Turns the form's flat strings back into the right types for Zod. */
function readPropertyForm(formData: FormData) {
  const list = (value: FormDataEntryValue | null) =>
    String(value ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const parseJson = (value: FormDataEntryValue | null): unknown => {
    try {
      return JSON.parse(String(value ?? "[]"));
    } catch {
      return [];
    }
  };

  const images = parseJson(formData.get("images"));
  const videos = parseJson(formData.get("videos"));

  return {
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    subtitle: formData.get("subtitle") ?? "",
    propertyType: formData.get("propertyType") ?? "apartment",
    purpose: formData.get("purpose") ?? "buy",
    status: formData.get("status") ?? "available",
    possession: formData.get("possession") ?? "",
    price: formData.get("price") ?? 0,
    location: formData.get("location") ?? "",
    city: formData.get("city") ?? "",
    address: formData.get("address") ?? "",
    bedrooms: formData.get("bedrooms") ?? 0,
    bathrooms: formData.get("bathrooms") ?? 0,
    area: formData.get("area") ?? 0,
    areaUnit: formData.get("areaUnit") ?? "sq.ft.",
    parking: formData.get("parking") ?? "",
    facing: formData.get("facing") ?? "",
    floor: formData.get("floor") ?? "",
    summary: formData.get("summary") ?? "",
    description: formData.get("description") ?? "",
    amenities: list(formData.get("amenities")),
    highlights: list(formData.get("highlights")),
    agentName: formData.get("agentName") ?? "",
    agentRole: formData.get("agentRole") ?? "",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    images,
    videos,
    videoEmbedUrl: formData.get("videoEmbedUrl") ?? "",
  };
}

export async function saveProperty(id: string | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = propertySchema.safeParse(readPropertyForm(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: collectErrors(parsed.error.issues) };
  }

  // Two properties must never share a slug — the URL would be ambiguous.
  const free = await isSlugAvailable(parsed.data.slug, id ?? undefined);
  if (!free) {
    return {
      ok: false,
      message: "That web address is already used by another property.",
      fieldErrors: { slug: "This slug is already taken" },
    };
  }

  try {
    if (id) {
      await updateProperty(id, parsed.data);
    } else {
      await createProperty(parsed.data);
    }
  } catch (error) {
    console.error("Saving property failed:", error);
    return { ok: false, message: "Could not save the property. Please try again." };
  }

  refreshPublicPages(parsed.data.slug);
  redirect("/admin/properties");
}

export async function removeProperty(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const property = await getPropertyById(id);
    await deleteProperty(id);
    refreshPublicPages(property?.slug);
    return { ok: true };
  } catch (error) {
    console.error("Deleting property failed:", error);
    return { ok: false, message: "Could not delete the property." };
  }
}

export async function toggleFlag(
  id: string,
  field: "featured" | "published",
  value: boolean
): Promise<ActionResult> {
  await requireAdmin();
  try {
    await setPropertyFlag(id, field, value);
    const property = await getPropertyById(id);
    refreshPublicPages(property?.slug);
    return { ok: true };
  } catch (error) {
    console.error("Updating property failed:", error);
    return { ok: false, message: "Could not update the property." };
  }
}

export async function changePropertyStatus(id: string, status: PropertyStatus): Promise<ActionResult> {
  await requireAdmin();
  try {
    await setPropertyStatus(id, status);
    const property = await getPropertyById(id);
    refreshPublicPages(property?.slug);
    return { ok: true };
  } catch (error) {
    console.error("Updating status failed:", error);
    return { ok: false, message: "Could not change the status." };
  }
}

export async function changeBookingStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = bookingStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Unknown booking status." };
  try {
    await setBookingStatus(id, parsed.data);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Updating booking failed:", error);
    return { ok: false, message: "Could not update the booking." };
  }
}

export async function removeBooking(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteBooking(id);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Deleting booking failed:", error);
    return { ok: false, message: "Could not delete the booking." };
  }
}

export async function changeEnquiryStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = enquiryStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Unknown enquiry status." };
  try {
    await setEnquiryStatus(id, parsed.data);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Updating enquiry failed:", error);
    return { ok: false, message: "Could not update the enquiry." };
  }
}

export async function removeEnquiry(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteEnquiry(id);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Deleting enquiry failed:", error);
    return { ok: false, message: "Could not delete the enquiry." };
  }
}