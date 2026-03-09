import { cookies } from "next/headers";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { USER_ROLE_KEY } from "@/routes/auth-keys";
import { toDashboardRole, type DashboardRole } from "@/routes/dashboard-routes";

const dashboardCopyByRole: Record<
  DashboardRole,
  { title: string; description: string }
> = {
  ADMIN: {
    title: "Admin Dashboard",
    description:
      "Monitor platform activity, user operations, and overall system performance.",
  },
  TEACHER: {
    title: "Teacher Dashboard",
    description:
      "Track classroom progress, student engagement, and your teaching activities.",
  },
  STUDENT: {
    title: "Student Dashboard",
    description:
      "See your latest class updates, assignments, and learning progress at a glance.",
  },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = toDashboardRole(cookieStore.get(USER_ROLE_KEY)?.value) ?? "TEACHER";
  const copy = dashboardCopyByRole[role];

  return (
    <DashboardPageContent
      role={role}
      title={copy.title}
      description={copy.description}
    />
  );
}
