import { TeacherDataTable } from "@/components/dashboard/teachers/teacher-datatable";

export default function DashboardTeacherPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teacher Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage teacher accounts with create, edit, suspend, and delete actions.
        </p>
      </div>
      <TeacherDataTable />
    </section>
  );
}

