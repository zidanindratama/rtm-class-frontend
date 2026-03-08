export type UtilPage = {
  id: string;
  name: string;
  statusCode: string;
  summary: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export const mockUtilPages: UtilPage[] = [
  {
    id: "not-found",
    name: "Not Found",
    statusCode: "404",
    summary: "Shown when a route does not exist or content has moved.",
    eyebrow: "Resource Missing",
    title: "The page you are looking for does not exist.",
    description:
      "The URL may be outdated, removed, or typed incorrectly. Return to the main pages and continue your flow.",
    primaryCtaLabel: "Create Account",
    primaryCtaHref: "/auth/sign-up",
    secondaryCtaLabel: "Sign In",
    secondaryCtaHref: "/auth/sign-in",
  },
  {
    id: "access-denied",
    name: "Access Denied",
    statusCode: "403",
    summary: "Shown when a user does not have permission to view a page.",
    eyebrow: "Permission Restricted",
    title: "You do not have access to this resource.",
    description:
      "Your account is authenticated, but this page requires elevated permissions. Contact your administrator for access.",
    primaryCtaLabel: "Create Account",
    primaryCtaHref: "/auth/sign-up",
    secondaryCtaLabel: "Sign In",
    secondaryCtaHref: "/auth/sign-in",
  },
  {
    id: "server-error",
    name: "Server Error",
    statusCode: "500",
    summary: "Shown when an unexpected backend or rendering error occurs.",
    eyebrow: "Unexpected Failure",
    title: "Something broke on our side.",
    description:
      "An internal error interrupted your request. Try again in a moment, or report the issue to our support team.",
    primaryCtaLabel: "Create Account",
    primaryCtaHref: "/auth/sign-up",
    secondaryCtaLabel: "Sign In",
    secondaryCtaHref: "/auth/sign-in",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    statusCode: "503",
    summary: "Shown when the platform is temporarily offline for updates.",
    eyebrow: "Scheduled Maintenance",
    title: "We are improving the platform right now.",
    description:
      "RTM Class is temporarily unavailable while we deploy updates. Service will be restored as soon as maintenance is complete.",
    primaryCtaLabel: "Create Account",
    primaryCtaHref: "/auth/sign-up",
    secondaryCtaLabel: "Sign In",
    secondaryCtaHref: "/auth/sign-in",
  },
  {
    id: "under-construction",
    name: "Under Construction",
    statusCode: "Soon",
    summary: "Shown when a feature page is planned but not yet published.",
    eyebrow: "Work In Progress",
    title: "This page is currently under construction.",
    description:
      "We are designing and validating this feature before launch. Check back soon for the complete experience.",
    primaryCtaLabel: "Create Account",
    primaryCtaHref: "/auth/sign-up",
    secondaryCtaLabel: "Sign In",
    secondaryCtaHref: "/auth/sign-in",
  },
];

export function getMockUtilPageById(id: string) {
  return mockUtilPages.find((page) => page.id === id);
}
