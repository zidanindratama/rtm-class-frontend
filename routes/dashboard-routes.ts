import { type AuthRole, isAuthRole } from "@/routes/auth-keys";

export type DashboardRole = AuthRole;

export type DashboardSubItem = {
  label: string;
  href: string;
};

export type DashboardItem = {
  key: string;
  label: string;
  href?: string;
  iconKey:
    | "dashboard"
    | "management"
    | "classroom"
    | "forum"
    | "blog"
    | "profile";
  children?: DashboardSubItem[];
};

export const dashboardNavByRole: Record<DashboardRole, DashboardItem[]> = {
  ADMIN: [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      iconKey: "dashboard",
    },
    {
      key: "management",
      label: "Users Management",
      iconKey: "management",
      children: [
        { label: "Admins", href: "/dashboard/admins" },
        { label: "Teachers", href: "/dashboard/teachers" },
        { label: "Students", href: "/dashboard/students" },
      ],
    },
    {
      key: "classes",
      label: "Classes",
      iconKey: "classroom",
      children: [
        { label: "All Classes", href: "/dashboard/classes" },
        { label: "Create Class", href: "/dashboard/classes/create" },
      ],
    },
    {
      key: "blogs",
      label: "Blog CMS",
      href: "/dashboard/blogs",
      iconKey: "blog",
      children: [
        { label: "All Blogs", href: "/dashboard/blogs" },
        { label: "Create Blog", href: "/dashboard/blogs/create" },
      ],
    },
    {
      key: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      iconKey: "profile",
    },
  ],
  TEACHER: [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      iconKey: "dashboard",
    },
    {
      key: "classroom",
      label: "Classroom",
      iconKey: "classroom",
      children: [
        { label: "My Class", href: "/dashboard/my-class" },
        { label: "Create Class", href: "/dashboard/classes/create" },
        { label: "Join Class", href: "/dashboard/classes/join" },
      ],
    },
    {
      key: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      iconKey: "profile",
    },
  ],
  STUDENT: [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      iconKey: "dashboard",
    },
    {
      key: "my-class",
      label: "My Class",
      href: "/dashboard/my-class",
      iconKey: "classroom",
    },
    {
      key: "join-class",
      label: "Join Class",
      href: "/dashboard/classes/join",
      iconKey: "classroom",
    },
    {
      key: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      iconKey: "profile",
    },
  ],
};

export const dashboardHomeByRole: Record<DashboardRole, string> = {
  ADMIN: "/dashboard",
  TEACHER: "/dashboard",
  STUDENT: "/dashboard",
};

type DashboardAccessPolicy = {
  prefix: string;
  allowedRoles: DashboardRole[];
};

const dashboardAccessPolicies: DashboardAccessPolicy[] = [
  { prefix: "/dashboard/admins", allowedRoles: ["ADMIN"] },
  { prefix: "/dashboard/teachers", allowedRoles: ["ADMIN"] },
  { prefix: "/dashboard/students", allowedRoles: ["ADMIN"] },

  { prefix: "/dashboard/blogs", allowedRoles: ["ADMIN"] },

  { prefix: "/dashboard/classes", allowedRoles: ["ADMIN", "TEACHER"] },
  { prefix: "/dashboard/classes/create", allowedRoles: ["ADMIN", "TEACHER"] },
  { prefix: "/dashboard/classes/join", allowedRoles: ["TEACHER", "STUDENT"] },

  { prefix: "/dashboard/my-class", allowedRoles: ["TEACHER", "STUDENT"] },
  { prefix: "/dashboard/forums", allowedRoles: ["ADMIN"] },

  {
    prefix: "/dashboard/profile",
    allowedRoles: ["ADMIN", "TEACHER", "STUDENT"],
  },
];

const normalizePath = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

export const toDashboardRole = (
  value: string | null | undefined,
): DashboardRole | null => (isAuthRole(value) ? value : null);

export const resolveDashboardHome = (role: string | null | undefined) => {
  const parsedRole = toDashboardRole(role);
  if (!parsedRole) return "/dashboard";
  return dashboardHomeByRole[parsedRole];
};

export const canAccessDashboardPath = (
  pathname: string,
  role: string | null | undefined,
) => {
  const normalizedPath = normalizePath(pathname);
  if (normalizedPath === "/dashboard") return true;

  const matchedPolicy = [...dashboardAccessPolicies]
    .sort((first, second) => second.prefix.length - first.prefix.length)
    .find(
      (policy) =>
        normalizedPath === policy.prefix ||
        normalizedPath.startsWith(`${policy.prefix}/`),
    );

  if (!matchedPolicy) return true;

  const parsedRole = toDashboardRole(role);
  if (!parsedRole) return false;

  return matchedPolicy.allowedRoles.includes(parsedRole);
};
