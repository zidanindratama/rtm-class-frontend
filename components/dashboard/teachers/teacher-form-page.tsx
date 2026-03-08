"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { usePostData } from "@/hooks/use-post-data";
import type {
  CreateTeacherPayload,
  UpdateTeacherPayload,
  UserDetailResponse,
} from "@/components/dashboard/teachers/teacher-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const createTeacherSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Password must include uppercase, lowercase, number, and symbol."
    ),
});

const editTeacherSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.email("Please enter a valid email address."),
  isSuspended: z.enum(["false", "true"]),
});

type CreateTeacherValues = z.infer<typeof createTeacherSchema>;
type EditTeacherValues = z.infer<typeof editTeacherSchema>;

type TeacherFormPageProps = {
  mode: "create" | "edit";
  teacherId?: string;
};

export function TeacherFormPage({ mode, teacherId }: TeacherFormPageProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const createForm = useForm<CreateTeacherValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const editForm = useForm<EditTeacherValues>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      isSuspended: "false",
    },
  });

  const {
    data: detailResponse,
    isLoading: isLoadingTeacher,
    isError: isDetailError,
  } = useGetData<UserDetailResponse>({
    key: ["admin", "teachers", "detail", teacherId],
    endpoint: `/admin/users/${teacherId}`,
    extractData: false,
    enabled: isEditMode && Boolean(teacherId),
    errorMessage: "Failed to load teacher detail.",
  });

  useEffect(() => {
    if (!isEditMode || !detailResponse?.data) {
      return;
    }

    editForm.reset({
      fullName: detailResponse.data.fullName,
      email: detailResponse.data.email,
      isSuspended: String(detailResponse.data.isSuspended) as "false" | "true",
    });
  }, [detailResponse?.data, editForm, isEditMode]);

  const createTeacherMutation = usePostData<unknown, CreateTeacherPayload>({
    key: ["admin", "teachers", "create"],
    endpoint: "/admin/users",
    successMessage: "Teacher created successfully.",
    errorMessage: "Failed to create teacher.",
    invalidateKeys: [["admin", "teachers"]],
    options: {
      onSuccess: () => router.push("/dashboard/teachers"),
    },
  });

  const updateTeacherMutation = usePatchData<unknown, UpdateTeacherPayload>({
    key: ["admin", "teachers", "update", teacherId],
    endpoint: `/admin/users/${teacherId}`,
    successMessage: "Teacher updated successfully.",
    errorMessage: "Failed to update teacher.",
    invalidateKeys: [["admin", "teachers"], ["admin", "teachers", "detail", teacherId]],
    options: {
      onSuccess: () => router.push("/dashboard/teachers"),
    },
  });

  const handleCreate = (values: CreateTeacherValues) => {
    createTeacherMutation.mutate({
      ...values,
      role: "TEACHER",
    });
  };

  const handleEdit = (values: EditTeacherValues) => {
    updateTeacherMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      isSuspended: values.isSuspended === "true",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/teachers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to teacher list
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? "Edit Teacher" : "Create Teacher"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update teacher account details and access status."
              : "Create a new teacher account with secure credentials."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>
              Fill required fields below before saving changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode && isLoadingTeacher ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Spinner />
                Loading teacher detail...
              </div>
            ) : isEditMode && isDetailError ? (
              <p className="text-sm text-muted-foreground">
                Unable to load teacher detail.
              </p>
            ) : isEditMode ? (
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEdit)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <FormField
                    control={editForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="isSuspended"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">Active</SelectItem>
                            <SelectItem value="true">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/teachers")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateTeacherMutation.isPending}>
                      {updateTeacherMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <FormField
                    control={createForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/teachers")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTeacherMutation.isPending}>
                      {createTeacherMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Form guideline for teacher account setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use active email address for account notifications.</p>
            <p>- Password must include uppercase, lowercase, number, and symbol.</p>
            <p>- Suspended teacher cannot access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

