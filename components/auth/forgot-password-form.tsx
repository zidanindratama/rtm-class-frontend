"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePostData } from "@/hooks/use-post-data";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = usePostData<unknown, ForgotPasswordValues>({
    endpoint: "/auth/forgot-password",
    successMessage: "Email sent successfully.",
    errorMessage: "Failed to send email.",
    options: {
      onSuccess: () => {
        router.push("/auth/reset-password");
      },
    },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    forgotPasswordMutation.mutate(values);
  };

  const isSubmitting =
    forgotPasswordMutation.isPending || form.formState.isSubmitting;

  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your account email and we'll send an OTP to reset your password."
      footerText="Remembered your password?"
      footerLinkText="Back to Sign In"
      footerLinkHref="/auth/sign-in"
    >
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Frontend is ready. Submit currently validates and logs payload to
            console.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isSubmitting ? "Submitting..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
