 
import { AdminClassesGrid } from "@/components/dashboard/classes/classes-grid";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";

export default function DashboardClassesPage() {
  return (
    <>
      <DashboardPageContent
        title="Classes Management"
        description="Manage active classes, assign teachers, and monitor student enrollments."
      />
      <AdminClassesGrid />
    </>
  );
}