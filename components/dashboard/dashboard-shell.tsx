"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Shield,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/main/common/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authTokenStorage } from "@/lib/axios-instance";
import {
  dashboardNavByRole,
  type DashboardItem,
  type DashboardRole,
} from "@/routes/dashboard-routes";
import { cn } from "@/lib/utils";
const iconByKey: Record<
  DashboardItem["iconKey"],
  ComponentType<{ className?: string }>
> = {
  dashboard: LayoutDashboard,
  management: Users,
  classroom: ClipboardList,
  forum: MessageSquare,
  blog: FileText,
  profile: UserRound,
};

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

export function DashboardShell({ children, role }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const items = useMemo(() => dashboardNavByRole[role], [role]);
  const [menuOverrides, setMenuOverrides] = useState<Record<string, boolean>>(
    {},
  );

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setDesktopSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    authTokenStorage.clearAuthTokens();
    toast.success("Signed out successfully.");
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-screen bg-background">
      {mobileSidebarOpen && isMobile ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-border/70 bg-card transition-transform duration-200 md:hidden",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <DashboardSidebarContent
            items={items}
            pathname={pathname}
            menuOverrides={menuOverrides}
            setMenuOverrides={setMenuOverrides}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </aside>

        <aside
          className={cn(
            "hidden border-r border-border/70 bg-card transition-[width] duration-200 md:block",
            desktopSidebarOpen ? "w-64" : "w-0 border-r-0",
          )}
        >
          <div className={cn("h-full", !desktopSidebarOpen && "hidden")}>
            <DashboardSidebarContent
              items={items}
              pathname={pathname}
              menuOverrides={menuOverrides}
              setMenuOverrides={setMenuOverrides}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-background/90 px-3 backdrop-blur md:px-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {mobileSidebarOpen && isMobile ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <p className="text-sm font-medium text-muted-foreground">
                {role} Dashboard
              </p>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 rounded-full px-1.5 md:px-2"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{role.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden text-sm md:inline">
                      {role}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <UserRound className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

type SidebarContentProps = {
  items: DashboardItem[];
  pathname: string;
  menuOverrides: Record<string, boolean>;
  setMenuOverrides: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  onNavigate?: () => void;
};

function DashboardSidebarContent({
  items,
  pathname,
  menuOverrides,
  setMenuOverrides,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
        <Shield className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">RTM Dashboard</p>
      </div>

      <nav className="mt-4 space-y-1">
        {items.map((item) => {
          const isParentActive = item.href ? pathname === item.href : false;
          const hasChildren = Boolean(item.children?.length);
          const hasActiveChild =
            hasChildren &&
            item.children!.some((child) => pathname === child.href);
          const isActive = isParentActive || hasActiveChild;
          const Icon = iconByKey[item.iconKey];

          if (hasChildren) {
            const isOpen =
              menuOverrides[item.key] ??
              item.children!.some((child) => pathname === child.href);

            return (
              <div key={item.key} className="rounded-lg">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() =>
                    setMenuOverrides((current) => ({
                      ...current,
                      [item.key]: !isOpen,
                    }))
                  }
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isOpen ? (
                  <div className="mt-1 space-y-1 pl-6">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                            isChildActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href!}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
