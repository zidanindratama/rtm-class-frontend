"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleEnum = z.enum(["TEACHER", "STUDENT"], {
  error: "Please select a role.",
});

const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Password must include uppercase, lowercase, number, and symbol."
    ),
  role: roleEnum,
});

type SignUpValues = z.infer<typeof signUpSchema>;
type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: AuthRole;
  isSuspended: boolean;
};

type SignUpResponseData = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const signUpMutation = usePostData<SignUpResponseData, SignUpValues>({
    key: ["auth", "sign-up"],
    endpoint: "/auth/sign-up",
    successMessage: "",
    errorMessage: "Sign-up failed.",
    options: {
      onSuccess: (data) => {
        const role = isAuthRole(data.user.role) ? data.user.role : undefined;
        authTokenStorage.setAuthTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          role,
        });
        toast.success("Account created successfully.");
        router.push("/dashboard");
      },
    },
  });

  const onSubmit = (values: SignUpValues) => {
    signUpMutation.mutate(values);
  };

  return (
    <AuthShell
      title="Create Account"
      description="Sign up as a teacher or student to access RTM Class AI."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/auth/sign-in"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Payload: fullName, email, password, role.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
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

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEACHER">TEACHER</SelectItem>
                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
                {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}


