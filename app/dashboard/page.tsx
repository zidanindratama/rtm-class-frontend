import { cookies } from "next/headers";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { USER_ROLE_KEY } from "@/routes/auth-keys";
import { toDashboardRole } from "@/routes/dashboard-routes";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = toDashboardRole(cookieStore.get(USER_ROLE_KEY)?.value) ?? "TEACHER";

  return <DashboardPageContent role={role} />;
}
