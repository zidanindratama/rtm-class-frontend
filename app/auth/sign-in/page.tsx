import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to RTM Class and continue your classroom workflow.",
  path: "/auth/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return <SignInForm />;
}
