import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PropertyForm from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/auth/session";
import { getPropertyById } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const property = await getPropertyById(id).catch(() => null);
  if (!property) notFound();

  return (
    <AdminShell admin={admin} title={`Edit — ${property.title}`}>
      <PropertyForm property={property} />
    </AdminShell>
  );
}
