/**
 * Everything WhatsApp. The number itself lives in siteConfig, which
 * reads it from the environment — it is never written into a component.
 */
import { siteConfig } from "@/config/site";
import { prettyDate } from "@/lib/format";

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** General "tell me more" message used by the floating button and CTAs. */
export function quickChatMessage(about?: string): string {
  return `Hello ${siteConfig.brand} ${siteConfig.brandLine}, I would like to know more about ${
    about || "your properties"
  }.`;
}

export interface BookingMessageInput {
  customerName: string;
  phone: string;
  propertyTitle: string;
  visitDate: string;
  visitTime: string;
  message?: string;
}

export function bookingMessage(b: BookingMessageInput): string {
  const lines = [
    `NEW ${siteConfig.brand} PROPERTY ENQUIRY`,
    "",
    `Name: ${b.customerName}`,
    `Phone: ${b.phone}`,
    `Property: ${b.propertyTitle}`,
    `Visit Date: ${prettyDate(b.visitDate)}`,
    `Visit Time: ${b.visitTime}`,
  ];
  if (b.message?.trim()) lines.push("", "Message:", b.message.trim());
  return lines.join("\n");
}

export interface EnquiryMessageInput {
  customerName: string;
  phone: string;
  email?: string;
  propertyTitle: string;
  message: string;
}

export function enquiryMessage(e: EnquiryMessageInput): string {
  const lines = [
    `NEW ${siteConfig.brand} ENQUIRY`,
    "",
    `Name: ${e.customerName}`,
    `Phone: ${e.phone}`,
  ];
  if (e.email?.trim()) lines.push(`Email: ${e.email.trim()}`);
  lines.push(`Interested in: ${e.propertyTitle}`, "", "Message:", e.message.trim());
  return lines.join("\n");
}

/** Time slots offered in the booking form. */
export const VISIT_TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];
