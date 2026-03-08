import { AdminFormPage } from "@/components/dashboard/admins/admin-form-page";

type DashboardAdminEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardAdminEditPage({
  params,
}: DashboardAdminEditPageProps) {
  const { id } = await params;
  return <AdminFormPage mode="edit" adminId={id} />;
}
