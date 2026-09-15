/**
 * Zod schema for a property. Both the admin form and the server action
 * run data through this, so an invalid record can never reach Firestore.
 */
import { z } from "zod";
import { PROPERTY_TYPES, PURPOSES, PROPERTY_STATUSES, AREA_UNITS } from "@/types";

export const propertyImageSchema = z.object({
  id: z.string().min(1),
  url: z.string().url("Image URL is not valid"),
  storagePath: z.string(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const propertyVideoSchema = z.object({
  id: z.string().min(1),
  url: z.string().url("Video URL is not valid"),
  storagePath: z.string(),
  name: z.string().max(200).default(""),
  sortOrder: z.number().int().min(0),
});

export const propertySchema = z.object({
  title: z.string().trim().min(3, "Title needs at least 3 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug needs at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  subtitle: z.string().trim().min(3, "Add a short type line, e.g. Luxury 3 BHK Apartment").max(120),
  propertyType: z.enum(PROPERTY_TYPES),
  purpose: z.enum(PURPOSES),
  status: z.enum(PROPERTY_STATUSES),
  possession: z.string().trim().max(60).default(""),
  price: z.coerce.number().positive("Price must be greater than zero"),
  location: z.string().trim().min(3, "Location is required").max(160),
  city: z.string().trim().min(2, "City is required").max(60),
  address: z.string().trim().max(300).default(""),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  area: z.coerce.number().positive("Area must be greater than zero"),
  areaUnit: z.enum(AREA_UNITS),
  parking: z.string().trim().max(60).default(""),
  facing: z.string().trim().max(60).default(""),
  floor: z.string().trim().max(60).default(""),
  summary: z.string().trim().min(10, "Write one line describing the property").max(300),
  description: z.string().trim().min(30, "Description needs at least 30 characters").max(4000),
  amenities: z.array(z.string().trim().min(1)).max(40).default([]),
  highlights: z.array(z.string().trim().min(1)).max(20).default([]),
  agentName: z.string().trim().max(80).default(""),
  agentRole: z.string().trim().max(80).default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  images: z.array(propertyImageSchema).default([]),
  videos: z.array(propertyVideoSchema).max(4).default([]),
  videoEmbedUrl: z
    .union([z.string().trim().url("Paste a full link, starting with https://"), z.literal("")])
    .default(""),
});

export type PropertyInput = z.infer<typeof propertySchema>;