"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  UserRound,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  dashboardNavByRole,
  type DashboardItem,
  type DashboardRole,
  type DashboardSubItem,
} from "@/routes/dashboard-routes";
import { useGetData } from "@/hooks/use-get-data";
import type { APIListResponse } from "@/types/api-response";
import type { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
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

const normalizePath = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

const MY_CLASS_PATH = "/dashboard/my-class";

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

const toClassMenuLabel = (classItem: ClassDetailResponse) => {
  const className = classItem.name?.trim();
  const classCode = classItem.classCode?.trim();

  if (className && classCode) {
    return `${className} (${classCode})`;
  }

  return className || classCode || "Untitled Class";
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: DashboardRole;
};

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const items = useMemo(() => dashboardNavByRole[role], [role]);
  const hasMyClassEntry = useMemo(
    () =>
      items.some(
        (item) =>
          item.href === MY_CLASS_PATH ||
          item.children?.some((child) => child.href === MY_CLASS_PATH),
      ),
    [items],
  );
  const { data: myClassResponse } = useGetData<
    APIListResponse<ClassDetailResponse>
  >({
    key: ["sidebar", "my-class"],
    endpoint: "/classes",
    extractData: false,
    enabled: hasMyClassEntry,
    params: {
      page: 1,
      per_page: 50,
      sort_by: "name",
      sort_order: "asc",
    },
    errorMessage: "Failed to load classes.",
    options: {
      staleTime: 60_000,
    },
  });
  const classDetailChildren = useMemo<DashboardSubItem[]>(
    () =>
      (myClassResponse?.data ?? []).map((classItem) => ({
        label: toClassMenuLabel(classItem),
        href: `${MY_CLASS_PATH}/${classItem.id}`,
      })),
    [myClassResponse?.data],
  );
  const myClassNestedChildren = useMemo<DashboardSubItem[]>(
    () => [{ label: "All My Classes", href: MY_CLASS_PATH }, ...classDetailChildren],
    [classDetailChildren],
  );
  const resolvedItems = useMemo<DashboardItem[]>(() => {
    return items.map((item) => {
      if (item.href === MY_CLASS_PATH) {
        return {
          ...item,
          children: myClassNestedChildren,
        };
      }

      return item;
    });
  }, [items, myClassNestedChildren]);
  const [menuOverrides, setMenuOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const { state, isMobile, setOpenMobile } = useSidebar();
  const handleMobileNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="inset"
      className="p-0 bg-[linear-gradient(180deg,hsl(215_72%_28%)_0%,hsl(221_68%_20%)_100%)] text-white"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/15 data-[state=open]:bg-white/15 data-[state=open]:text-white"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-cyan-300/90 text-xs font-bold text-blue-950">
                R
              </div>

              <div
                className={cn(
                  "grid flex-1 text-left  text-sm leading-tight",
                  isCollapsed && "hidden",
                )}
              >
                <span className="truncate font-semibold text-white">
                  RTM Class<span className="text-cyan-300">.ai</span>
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {resolvedItems.map((item) => {
            const isParentActive = item.href
              ? isPathActive(pathname, item.href)
              : false;
            const hasChildren = Boolean(item.children?.length);
            const activeChildHref = hasChildren
              ? getActiveChildHref(pathname, item.children)
              : null;
            const isActive = isParentActive || Boolean(activeChildHref);
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
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className="cursor-pointer"
                      >
                        <Icon />
                        <span>{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="ml-auto" />
                        ) : (
                          <ChevronRight className="ml-auto" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children?.map((child) => {
                          const isChildActive = child.href === activeChildHref;
                          const isNestedMyClassChild =
                            item.href !== MY_CLASS_PATH &&
                            child.href === MY_CLASS_PATH &&
                            classDetailChildren.length > 0;
                          const nestedMyClassActiveHref = isNestedMyClassChild
                            ? getActiveChildHref(pathname, myClassNestedChildren)
                            : null;
                          const nestedMyClassMenuKey = `${item.key}:${child.href}`;
                          const isNestedMyClassOpen = isNestedMyClassChild
                            ? (menuOverrides[nestedMyClassMenuKey] ??
                              Boolean(nestedMyClassActiveHref))
                            : false;

                          if (isNestedMyClassChild) {
                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <Collapsible
                                  open={isNestedMyClassOpen}
                                  onOpenChange={(open) =>
                                    setMenuOverrides((prev) => ({
                                      ...prev,
                                      [nestedMyClassMenuKey]: open,
                                    }))
                                  }
                                  className="group/nested-collapsible"
                                >
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton
                                      isActive={Boolean(nestedMyClassActiveHref)}
                                      className="cursor-pointer"
                                    >
                                      <span>{child.label}</span>
                                      {isNestedMyClassOpen ? (
                                        <ChevronDown className="ml-auto" />
                                      ) : (
                                        <ChevronRight className="ml-auto" />
                                      )}
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {myClassNestedChildren.map((classChild) => {
                                        const isClassChildActive =
                                          classChild.href === nestedMyClassActiveHref;

                                        return (
                                          <SidebarMenuSubItem key={classChild.href}>
                                            <SidebarMenuSubButton
                                              asChild
                                              isActive={isClassChildActive}
                                            >
                                              <Link
                                                href={classChild.href}
                                                onClick={handleMobileNavClick}
                                              >
                                                <span>{classChild.label}</span>
                                              </Link>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        );
                                      })}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </Collapsible>
                              </SidebarMenuSubItem>
                            );
                          }

                          return (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isChildActive}
                              >
                                <Link
                                  href={child.href}
                                  onClick={handleMobileNavClick}
                                >
                                  <span>{child.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
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
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link
                    href={item.href ?? "/dashboard"}
                    onClick={handleMobileNavClick}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {!isCollapsed && (
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
      )}
    </Sidebar>
  );
}
