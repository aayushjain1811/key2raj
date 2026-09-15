import { z } from "zod";
import { BOOKING_STATUSES } from "@/types";

/** Indian mobile numbers: 10 digits, optionally with +91 in front. */
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+?91)?[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number");

export const bookingSchema = z.object({
  propertyId: z.string().trim().min(1, "Choose a property"),
  propertyTitle: z.string().trim().min(1),
  customerName: z.string().trim().min(2, "Please enter your name").max(80),
  phone,
  email: z.union([z.string().trim().email("That email does not look right"), z.literal("")]).default(""),
  visitDate: z.string().trim().min(1, "Choose a date"),
  visitTime: z.string().trim().min(1, "Choose a time"),
  message: z.string().trim().max(1000).default(""),
});

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);
export type BookingInput = z.infer<typeof bookingSchema>;
