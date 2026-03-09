import { AdminBlogsGrid } from "@/components/dashboard/blogs/blogs-grid";

export default function DashboardBlogsPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Blog Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage blog posts with create, edit, publish, and delete actions.
        </p>
      </div>
      <AdminBlogsGrid />
    </section>
  );
}
