import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import TanStackProvider from "@/providers/tanstack-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RTM Class AI | Smart Learning Generator",
  description:
    "Generate MCQ, Essay, and Summary automatically using advanced AI.",
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
