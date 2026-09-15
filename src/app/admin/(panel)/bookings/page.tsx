import AdminShell from "@/components/admin/AdminShell";
import BookingTable from "@/components/admin/BookingTable";
import { requireAdmin } from "@/lib/auth/session";
import { getAllBookings } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const admin = await requireAdmin();
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];
  let failed = false;
  try {
    bookings = await getAllBookings();
  } catch (error) {
    console.error("Could not load bookings:", error);
    failed = true;
  }

  return (
    <AdminShell admin={admin} title="Bookings">
      {failed ? (
        <p className="note note-err">Unable to load bookings. Please refresh.</p>
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </AdminShell>
  );
}
