"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CircleHelp,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Users,
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/main/common/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
  const items = useMemo(() => dashboardNavByRole[role], [role]);
  const [menuOverrides, setMenuOverrides] = useState<Record<string, boolean>>(
    {},
  );

  const handleLogout = () => {
    authTokenStorage.clearAuthTokens();
    toast.success("Signed out successfully.");
    router.push("/auth/sign-in");
  };

  const normalizePath = (path: string) =>
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  const isPathActive = (currentPath: string, targetPath: string) => {
    const normalizedCurrentPath = normalizePath(currentPath);
    const normalizedTargetPath = normalizePath(targetPath);
    if (normalizedTargetPath === "/dashboard") {
      return normalizedCurrentPath === normalizedTargetPath;
    }
    return (
      normalizedCurrentPath === normalizedTargetPath ||
      normalizedCurrentPath.startsWith(`${normalizedTargetPath}/`)
    );
  };

  const getActiveChildHref = (
    currentPath: string,
    children: DashboardItem["children"],
  ) => {
    if (!children?.length) return null;
    const matchingChildren = children
      .filter((child) => isPathActive(currentPath, child.href))
      .sort((a, b) => b.href.length - a.href.length);
    return matchingChildren[0]?.href ?? null;
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-primary/30 p-0">
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,hsl(218_76%_21%)_0%,hsl(221_78%_16%)_100%)] text-slate-100">
          <SidebarHeader className="p-3 pb-0 shrink-0">
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300/90 text-sm font-bold text-blue-950">
                R
              </div>
              <p className="text-sm font-semibold text-slate-50">
                RTM Class<span className="text-cyan-300">.ai</span>
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4 flex-1 min-h-0">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isParentActive = item.href
                  ? isPathActive(pathname, item.href)
                  : false;
                const hasChildren = Boolean(item.children?.length);
                const activeChildHref = hasChildren
                  ? getActiveChildHref(pathname, item.children)
                  : null;
                const hasActiveChild = Boolean(activeChildHref);
                const isActive = isParentActive || hasActiveChild;
                const Icon = iconByKey[item.iconKey];

                if (hasChildren) {
                  const isOpen =
                    menuOverrides[item.key] ?? Boolean(activeChildHref);

                  return (
                    <Collapsible
                      key={item.key}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setMenuOverrides((prev) => ({
                          ...prev,
                          [item.key]: open,
                        }))
                      }
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-blue-200/20 text-blue-50"
                                : "text-slate-200 hover:bg-white/10 hover:text-white",
                            )}
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
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="mt-1 space-y-1 border-l-0 pl-6">
                            {item.children!.map((child) => {
                              const isChildActive =
                                child.href === activeChildHref;
                              return (
                                <SidebarMenuSubItem key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                                      isChildActive
                                        ? "bg-blue-200/85 text-blue-950"
                                        : "text-slate-300 hover:bg-white/10 hover:text-white",
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.key}>
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-blue-200/85 text-blue-950"
                          : "text-slate-200 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="shrink-0 space-y-3 p-3 pt-4">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300/90">
              Need Help?
            </p>

            <Link
              href="/contact"
              className="block rounded-xl border border-white/15 bg-white/10 p-4 text-slate-100 transition-colors hover:bg-white/15"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <LifeBuoy className="h-4 w-4 text-cyan-300" />
                  Contact Support
                </span>
                <ExternalLink className="h-4 w-4 text-slate-300" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Report issues, ask questions, or request help from the team.
              </p>
            </Link>

            <Link
              href="/how-it-works"
              className="block rounded-xl border border-cyan-200/35 bg-cyan-200/15 p-4 text-cyan-50 transition-colors hover:bg-cyan-200/20"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <CircleHelp className="h-4 w-4" />
                  How It Works
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-cyan-100/90">
                Read the workflow guide to understand platform features quickly.
              </p>
            </Link>
          </SidebarFooter>
        </div>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-background/90 px-3 backdrop-blur md:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-9 w-9" />
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
                  <span className="ml-2 hidden text-sm md:inline">{role}</span>
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
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
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
    </SidebarProvider>
  );
}
