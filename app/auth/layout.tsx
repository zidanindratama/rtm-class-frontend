import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Authentication",
  description: "Access your RTM Class account to manage classes and learning workflows.",
  path: "/auth/sign-in",
  noIndex: true,
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.14), transparent 42%), radial-gradient(circle at 80% 0%, hsl(var(--accent) / 0.16), transparent 45%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
