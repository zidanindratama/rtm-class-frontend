"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { LoggedProfile } from "@/components/globals/profile/logged-profile";
import { ThemeToggle } from "@/components/main/common/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { DashboardRole } from "@/routes/dashboard-routes";

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
  breadcrumb: React.ReactNode;
};

export function DashboardShell({
  children,
  role,
  breadcrumb,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumb}
          </div>

          <div className="flex items-center gap-2 md:px-4">
            <ThemeToggle />
            <LoggedProfile />
          </div>
        </header>

        <div className="flex flex-1 flex-col mt-4 gap-4 p-4 pt-0 md:p-6 md:pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
