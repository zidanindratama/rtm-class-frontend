import { AdminClassesGrid } from "@/components/dashboard/classes/classes-grid";

export default function DashboardClassesPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Class Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage classes with create, edit, and delete actions.
        </p>
      </div>
      <AdminClassesGrid />
    </section>
  );
}
