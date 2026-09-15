import AdminShell from "@/components/admin/AdminShell";
import PropertyForm from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const admin = await requireAdmin();
  return (
    <AdminShell admin={admin} title="Add property">
      <PropertyForm />
    </AdminShell>
  );
}
