import { AdminBlogsGrid } from "@/components/dashboard/blogs/blogs-grid";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";

export default function DashboardBlogsPage() {
  return (<>
  
    <DashboardPageContent
      title="Blog CMS"
      description="Manage blog drafts, publish updates, and organize learning content."
    />
    <AdminBlogsGrid/>
  </>
  );
}
