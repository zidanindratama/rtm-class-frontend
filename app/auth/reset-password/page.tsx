import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description: "Set a new password for your RTM Class account.",
  path: "/auth/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
