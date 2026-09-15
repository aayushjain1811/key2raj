"use client";

/**
 * Small client-side buttons. Server components cannot have onClick, so
 * any button that opens the booking modal or WhatsApp lives here.
 */
import { useBooking } from "@/components/booking/BookingProvider";
import { WaIcon } from "@/components/icons";
import { quickChatMessage, whatsappLink } from "@/lib/whatsapp";

export function BookVisitButton({
  propertyId,
  className = "btn btn-gold",
  children = "Book a site visit",
}: {
  propertyId?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useBooking();
  return (
    <button className={className} type="button" onClick={() => open(propertyId)}>
      {children}
    </button>
  );
}

export function WhatsAppButton({
  about,
  className = "btn btn-wa",
  children,
}: {
  about?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={whatsappLink(quickChatMessage(about))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WaIcon />
      {children ?? "WhatsApp"}
    </a>
  );
}
