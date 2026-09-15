import AdminShell from "@/components/admin/AdminShell";
import PropertyTable from "@/components/admin/PropertyTable";
import { requireAdmin } from "@/lib/auth/session";
import { getAllProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const admin = await requireAdmin();
  let properties: Awaited<ReturnType<typeof getAllProperties>> = [];
  let failed = false;

  try {
    properties = await getAllProperties();
  } catch (error) {
    console.error("Could not load properties:", error);
    failed = true;
  }

  return (
    <AdminShell admin={admin} title="Properties">
      {failed ? (
        <p className="note note-err">Unable to load properties. Check your Firebase settings and refresh.</p>
      ) : (
        <PropertyTable properties={properties} />
      )}
    </AdminShell>
  );
}
