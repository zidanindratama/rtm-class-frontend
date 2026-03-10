import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { USER_ROLE_KEY } from "@/routes/auth-keys";
import { toDashboardRole } from "@/routes/dashboard-routes";

export default async function DashboardLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role =
    toDashboardRole(cookieStore.get(USER_ROLE_KEY)?.value) ?? "TEACHER";

  return (
    <DashboardShell role={role} breadcrumb={breadcrumb}>
      {children}
    </DashboardShell>
  );
}
