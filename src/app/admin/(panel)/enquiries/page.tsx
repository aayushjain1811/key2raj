import AdminShell from "@/components/admin/AdminShell";
import EnquiryTable from "@/components/admin/EnquiryTable";
import { requireAdmin } from "@/lib/auth/session";
import { getAllEnquiries } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const admin = await requireAdmin();
  let enquiries: Awaited<ReturnType<typeof getAllEnquiries>> = [];
  let failed = false;
  try {
    enquiries = await getAllEnquiries();
  } catch (error) {
    console.error("Could not load enquiries:", error);
    failed = true;
  }

  return (
    <AdminShell admin={admin} title="Enquiries">
      {failed ? (
        <p className="note note-err">Unable to load enquiries. Please refresh.</p>
      ) : (
        <EnquiryTable enquiries={enquiries} />
      )}
    </AdminShell>
  );
}
