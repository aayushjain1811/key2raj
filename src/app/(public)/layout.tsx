import SiteNav from "@/components/public/SiteNav";
import SiteFooter from "@/components/public/SiteFooter";
import WhatsAppFab from "@/components/public/WhatsAppFab";
import Splash from "@/components/public/Splash";
import BookingProvider from "@/components/booking/BookingProvider";
import { getPublishedProperties } from "@/lib/properties";

/**
 * Shell for every public page: header, footer, floating WhatsApp button
 * and the booking modal. The property list is fetched once here so the
 * modal's dropdown is always current.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let options: { id: string; title: string }[] = [];
  try {
    const properties = await getPublishedProperties();
    options = properties.map((p) => ({ id: p.id, title: p.title }));
  } catch (error) {
    // If Firestore is unreachable the site still renders — the modal
    // simply falls back to "Not sure yet".
    console.error("Could not load properties for the booking modal:", error);
  }

  return (
    <BookingProvider properties={options}>
      <Splash />
      <SiteNav />
      <main id="view">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </BookingProvider>
  );
}