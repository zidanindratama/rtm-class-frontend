import { AdminDataTable } from "@/components/dashboard/admins/admin-datatable";

export default function DashboardAdminPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage admin accounts with create, edit, suspend, and delete actions.
        </p>
      </div>
      <AdminDataTable />
    </section>
  );
}

