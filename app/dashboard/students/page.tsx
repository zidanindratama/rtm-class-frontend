import { StudentDataTable } from "@/components/dashboard/students/student-datatable";

export default function DashboardStudentsPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Student Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage student accounts with create, edit, suspend, and delete actions.
        </p>
      </div>
      <StudentDataTable />
    </section>
  );
}
