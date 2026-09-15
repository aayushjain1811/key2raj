import { z } from "zod";
import { ENQUIRY_STATUSES } from "@/types";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+?91)?[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number");

export const enquirySchema = z.object({
  propertyId: z.string().trim().default(""),
  propertyTitle: z.string().trim().min(1, "Tell us what you are interested in"),
  customerName: z.string().trim().min(2, "Please enter your name").max(80),
  phone,
  email: z.union([z.string().trim().email("That email does not look right"), z.literal("")]).default(""),
  message: z.string().trim().min(5, "Please write a short message").max(1000),
  source: z.string().trim().default("contact-page"),
});

export const enquiryStatusSchema = z.enum(ENQUIRY_STATUSES);
export type EnquiryInput = z.infer<typeof enquirySchema>;
