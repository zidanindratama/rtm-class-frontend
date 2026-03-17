import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign Up",
  description: "Create your RTM Class account and start managing classes in one platform.",
  path: "/auth/sign-up",
  noIndex: true,
});

export default function SignUpPage() {
  return <SignUpForm />;
}
