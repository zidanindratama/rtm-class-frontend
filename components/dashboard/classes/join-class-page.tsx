"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePostData } from "@/hooks/use-post-data";
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

const joinClassSchema = z.object({
  classCode: z
    .string()
    .trim()
    .min(4, "Class code must be at least 4 characters.")
    .max(32, "Class code must be at most 32 characters."),
});

type JoinClassValues = z.infer<typeof joinClassSchema>;

function normalizeClassCode(rawValue: string) {
  return rawValue.toUpperCase().replace(/\s+/g, "").slice(0, 32);
}

export function JoinClassPage() {
  const router = useRouter();
  const [codePreview, setCodePreview] = useState("");

  const form = useForm<JoinClassValues>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: {
      classCode: "",
    },
  });

  const joinClassMutation = usePostData<unknown, { classCode: string }>({
    key: ["classes", "join"],
    endpoint: "/classes/join",
    successMessage: "Successfully joined class.",
    errorMessage: "Failed to join class.",
    invalidateKeys: [["my-class"], ["admin", "classes"]],
    options: {
      onSuccess: () => {
        router.push("/dashboard/my-class");
      },
    },
  });

  const handleSubmit = (values: JoinClassValues) => {
    joinClassMutation.mutate({
      classCode: normalizeClassCode(values.classCode),
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.14),transparent_52%)] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Student Access
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Join a Class with Access Code
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Enter the class code shared by your teacher. Once verified, you will get immediate access
          to class members, discussions, and upcoming learning activities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Join Form</CardTitle>
            <CardDescription>
              Use the code exactly as shared. We automatically normalize casing and spaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="classCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter class code"
                          value={field.value}
                          onChange={(event) => {
                            const normalizedCode = normalizeClassCode(event.target.value);
                            field.onChange(normalizedCode);
                            setCodePreview(normalizedCode);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Normalized code preview</p>
                  <p className="mt-1 text-sm font-semibold tracking-wide text-foreground">
                    {codePreview || "-"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                  <p className="text-xs text-muted-foreground">
                    If this code is invalid or expired, contact your class teacher.
                  </p>
                  <Button type="submit" disabled={joinClassMutation.isPending}>
                    {joinClassMutation.isPending ? "Joining..." : "Join Class"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple flow to access your class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="inline-flex items-start gap-2">
                <KeyRound className="mt-0.5 h-4 w-4" />
                Copy the class code from your teacher.
              </p>
              <p className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4" />
                Submit code to validate your access.
              </p>
              <p className="inline-flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4" />
                Start learning inside your class workspace.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>After Joining</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Your class will appear in <span className="font-medium text-foreground">My Classes</span>.
              </p>
              <p className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                You can view members and class updates instantly.
              </p>
              <p className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                You can join ongoing class discussions from the dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
