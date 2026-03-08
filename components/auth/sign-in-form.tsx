"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { usePostData } from "@/hooks/use-post-data";
import { authTokenStorage } from "@/lib/axios-instance";
import { type AuthRole, isAuthRole } from "@/routes/auth-keys";
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

const signInSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignInValues = z.infer<typeof signInSchema>;
type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: AuthRole;
  isSuspended: boolean;
};

type SignInResponseData = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
};

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = usePostData<SignInResponseData, SignInValues>({
    key: ["auth", "sign-in"],
    endpoint: "/auth/sign-in",
    successMessage: "",
    errorMessage: "Sign-in failed.",
    options: {
      onSuccess: (data) => {
        const role = isAuthRole(data.user.role) ? data.user.role : undefined;
        authTokenStorage.setAuthTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          role,
        });
        toast.success("Signed in successfully.");
        router.push("/dashboard");
      },
    },
  });

  const onSubmit = (values: SignInValues) => {
    signInMutation.mutate(values);
  };

  return (
    <AuthShell
      title="Sign In"
      description="Access your RTM Class AI dashboard to start learning or teaching."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkHref="/auth/sign-up"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Frontend is ready. Submit currently logs payload to console.
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
                      <Input type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowPassword((previous) => !previous)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
                {signInMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}


