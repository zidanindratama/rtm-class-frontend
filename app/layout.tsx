import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import TanStackProvider from "@/providers/tanstack-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RTM Class | Modern Classroom, Simplified",
    template: "%s | RTM Class",
  },
  description:
    "RTM Class helps schools and educators run live classes, manage assignments, create learning materials, and collaborate in one streamlined platform.",
  applicationName: "RTM Class",
  authors: [{ name: "RTM Class Team", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "RTM Class",
    "Learning Management System",
    "Classroom Management",
    "Online Class Platform",
    "Assignment Management",
    "School Dashboard",
    "Teacher Collaboration",
    "Student Progress Tracking",
    "Education Platform",
  ],
  creator: "RTM Class",
  publisher: "RTM Class",
  category: "education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "RTM Class | Modern Classroom, Simplified",
    description:
      "Manage modern classroom workflows end-to-end with live classes, assignments, materials, and collaboration in one platform.",
    siteName: "RTM Class",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "RTM Class platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RTM Class | Modern Classroom, Simplified",
    description:
      "Live classes, smart materials, assignments, and collaboration in one place.",
    images: ["/og-image.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
