import Link from "next/link";
import React, { cache } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { APISingleResponse } from "@/types/api-response";
import { serverApiGet } from "@/lib/server-get-api";

const segmentMap: Record<string, string> = {
  classes: "Classes",
  "my-class": "My Class",
  admins: "Admins",
  teachers: "Teachers",
  students: "Students",
  users: "Users",
  forums: "Forums",
  threads: "Threads",
  materials: "Materials",
  assignments: "Assignments",
  blogs: "Blogs",
  join: "Join",
  members: "Members",
  profile: "Profile",
  work: "Work",
  grade: "Grade",
  edit: "Edit",
  create: "Create",
};

function getEntityType(prev?: string) {
  const map: Record<string, string> = {
    classes: "classes",
    "my-class": "classes",
    blogs: "admin/blogs",
    materials: "materials",
    assignments: "assignments",
    forums: "forums/threads",
    threads: "forums/threads",
    admins: "admin/users",
    teachers: "admin/users",
    students: "admin/users",
    users: "admin/users",
  };

  return prev ? map[prev] : undefined;
}

const formatSegment = (segment: string) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const isUUID = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const getEntityName = cache(async (type: string, id: string) => {
  try {
    const res = await serverApiGet<
      APISingleResponse<{
        id: string;
        name?: string;
        title?: string;
        fullName?: string;
        full_name?: string;
      }>
    >(`/${type}/${id}`);

    const data = res.data;

    return (
      data.name ?? data.title ?? data.fullName ?? data.full_name ?? "Detail"
    );
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.log("Breadcrumb fetch failed:", { type, id });
    }
    return "Detail";
  }
});

type ResolvedBreadcrumbItem = {
  href: string;
  label: string;
  isLast: boolean;
};

type EllipsisItem = {
  ellipsis: true;
  key: string;
};

type VisibleItem = ResolvedBreadcrumbItem | EllipsisItem;

function isEllipsisItem(item: VisibleItem): item is EllipsisItem {
  return "ellipsis" in item;
}

export default async function DashboardBreadcrumb({
  params,
}: {
  params: Promise<{ all: string[] }>;
}) {
  const { all } = await params;

  const items: ResolvedBreadcrumbItem[] = await Promise.all(
    all.map(async (segment, index) => {
      const href = `/dashboard/${all.slice(0, index + 1).join("/")}`;
      const isLast = index === all.length - 1;

      let label = segmentMap[segment] ?? formatSegment(segment);

      if (isUUID(segment)) {
        const type = getEntityType(all[index - 1]);
        label = type ? await getEntityName(type, segment) : "Detail";
      }

      return { href, label, isLast };
    }),
  );

  const desktopVisibleItems: VisibleItem[] =
    items.length <= 2
      ? items
      : [
          items[0],
          { ellipsis: true, key: "desktop-ellipsis" },
          items[items.length - 1],
        ];

  const desktopHiddenItems =
    items.length <= 2 ? [] : items.slice(1, items.length - 1);
const mobileVisibleItems: VisibleItem[] =
  items.length === 0
    ? []
    : [{ ellipsis: true, key: "mobile-ellipsis" }];

const mobileHiddenItems = items;

  const renderEllipsis = (
    hiddenItems: ResolvedBreadcrumbItem[],
    key: string,
    className?: string,
  ) => (
    <React.Fragment key={key}>
      <BreadcrumbSeparator className={className} />
      <BreadcrumbItem className={cn("shrink-0", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              aria-label="Open breadcrumb menu"
            >
              <BreadcrumbEllipsis className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {hiddenItems.map((hidden) => (
              <DropdownMenuItem key={hidden.href} asChild>
                <Link href={hidden.href} className="max-w-[240px] truncate">
                  {hidden.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
    </React.Fragment>
  );

  const renderItem = (
    item: ResolvedBreadcrumbItem,
    prefix: string,
    className?: string,
  ) => (
    <React.Fragment key={`${prefix}-${item.href}`}>
      <BreadcrumbSeparator className={className} />
      <BreadcrumbItem className={cn("min-w-0", className)}>
        {item.isLast ? (
          <BreadcrumbPage
            className="block max-w-[120px] truncate sm:max-w-[160px] md:max-w-[220px]"
            title={item.label}
          >
            {item.label}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link
              href={item.href}
              className="block max-w-[90px] truncate sm:max-w-[120px] md:max-w-[160px]"
              title={item.label}
            >
              {item.label}
            </Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </React.Fragment>
  );

  return (
    <Breadcrumb className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap overflow-hidden"> 
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
 
        {mobileVisibleItems.map((item) =>
          isEllipsisItem(item)
            ? renderEllipsis(mobileHiddenItems, item.key, "md:hidden")
            : renderItem(item, "mobile", "md:hidden"),
        )}
 
        {desktopVisibleItems.map((item) =>
          isEllipsisItem(item)
            ? renderEllipsis(desktopHiddenItems, item.key, "hidden md:flex")
            : renderItem(item, "desktop", "hidden md:flex"),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
