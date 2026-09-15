/**
 * =====================================================================
 * SHARED TYPES
 * ---------------------------------------------------------------------
 * These describe the shape of everything stored in Firestore. If you
 * change a field here, TypeScript will point at every file that needs
 * updating. That is the whole reason this file exists.
 * =====================================================================
 */

export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "penthouse",
  "plot",
  "land",
  "commercial",
  "office",
  "shop",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Apartment",
  villa: "Villa",
  penthouse: "Penthouse",
  plot: "Plot",
  land: "Land",
  commercial: "Commercial",
  office: "Office",
  shop: "Shop",
};

export const PURPOSES = ["buy", "rent"] as const;
export type Purpose = (typeof PURPOSES)[number];

export const PROPERTY_STATUSES = [
  "available",
  "under-negotiation",
  "sold",
  "rented",
  "coming-soon",
  "inactive",
] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: "Available",
  "under-negotiation": "Under Negotiation",
  sold: "Sold",
  rented: "Rented",
  "coming-soon": "Coming Soon",
  inactive: "Inactive",
};

export const AREA_UNITS = ["sq.ft.", "sq.yd.", "sq.m."] as const;
export type AreaUnit = (typeof AREA_UNITS)[number];

/** One photo belonging to a property. The file itself lives in Storage. */
export interface PropertyImage {
  id: string;
  url: string;
  /** Path inside Firebase Storage, needed to delete the file later. */
  storagePath: string;
  isFeatured: boolean;
  sortOrder: number;
}

/** One video belonging to a property. The file itself lives in Storage. */
export interface PropertyVideo {
  id: string;
  url: string;
  /** Path inside Firebase Storage, needed to delete the file later. */
  storagePath: string;
  name: string;
  sortOrder: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  /** Small line above the title, e.g. "Luxury 3 BHK Apartment". */
  subtitle: string;
  propertyType: PropertyType;
  purpose: Purpose;
  status: PropertyStatus;
  /** Free text shown on the card chip, e.g. "Ready to Move". */
  possession: string;
  price: number;
  location: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: AreaUnit;
  parking: string;
  facing: string;
  floor: string;
  summary: string;
  description: string;
  amenities: string[];
  highlights: string[];
  agentName: string;
  agentRole: string;
  featured: boolean;
  published: boolean;
  images: PropertyImage[];
  videos: PropertyVideo[];
  /** A YouTube or Vimeo link, as an alternative to uploading. */
  videoEmbedUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUSES = [
  "new",
  "contacted",
  "confirmed",
  "visited",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  phone: string;
  email: string;
  visitDate: string;
  visitTime: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export const ENQUIRY_STATUSES = ["new", "contacted", "converted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  /** Where it came from: "contact-page", "property-page", etc. */
  source: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

/** The four tabs in the search panel. Derived, never stored. */
export type Category = "buy" | "rent" | "commercial" | "plots";