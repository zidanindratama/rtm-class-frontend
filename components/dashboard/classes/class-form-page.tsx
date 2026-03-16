"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetData } from "@/hooks/use-get-data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { type APISingleResponse } from "@/types/api-response";
import { authTokenStorage } from "@/lib/axios-instance";
import { CreateClassPayload, type ClassDetailResponse } from "./class-types";
import { EditClassForm } from "./edit-class-form";
import { CLASS_LEVELS } from "./class-constants";

const ACADEMIC_YEAR_REGEX = /^\d{4}\/\d{4}$/;
const ACADEMIC_YEAR_RANGE_SEPARATOR = "/";

function formatAcademicYearInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, 4)}/${digits.slice(4)}`;
}

function isValidAcademicYear(value: string) {
  if (!ACADEMIC_YEAR_REGEX.test(value)) {
    return false;
  }

  const [startYearRaw, endYearRaw] = value.split(ACADEMIC_YEAR_RANGE_SEPARATOR);
  const startYear = Number(startYearRaw);
  const endYear = Number(endYearRaw);

  if (Number.isNaN(startYear) || Number.isNaN(endYear)) {
    return false;
  }

  return endYear > startYear;
}

export const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required."),
  institutionName: z.string().optional(),
  classLevel: z.string().optional(),
  academicYear: z
    .string()
    .optional()
    .refine((value) => !value || isValidAcademicYear(value), {
      message:
        "Academic year must use YYYY/YYYY format, and the second year must be greater than the first year (e.g., 2025/2026).",
    }),
  description: z.string().optional(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

type ClassFormPageProps =
  | { mode: "create"; classId?: never }
  | { mode: "edit"; classId: string };

export function ClassFormPage({ mode, classId }: ClassFormPageProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const currentRole = authTokenStorage.getUserRole();
  const classListHref =
    currentRole === "ADMIN" ? "/dashboard/classes" : "/dashboard/my-class";

  const {
    data: detailResponse,
    isLoading: isLoadingClass,
    isError: isDetailError,
  } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["admin", "classes", "detail", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    enabled: isEditMode && Boolean(classId),
    errorMessage: "Failed to load class detail.",
  });

  const createClassMutation = usePostData<unknown, CreateClassPayload>({
    key: ["admin", "classes", "create"],
    endpoint: "/classes",
    successMessage: "Class created successfully.",
    errorMessage: "Failed to create class.",
    invalidateKeys: [["admin", "classes"]],
    options: {
      onSuccess: () => router.push(classListHref),
    },
  });

  const createForm = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      institutionName: "",
      classLevel: "",
      academicYear: "",
      description: "",
    },
  });

  const handleCreate = (values: ClassFormValues) => {
    createClassMutation.mutate({
      name: values.name,
      institutionName: values.institutionName || undefined,
      classLevel: values.classLevel || undefined,
      academicYear: values.academicYear || undefined,
      description: values.description || undefined,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href={classListHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to class list
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {isEditMode ? "View / Edit Class" : "Create Class"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "View class details and update class information."
              : "Create a new class for your institution."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>
              Fill out the details below. Only the class name is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode && isLoadingClass ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Spinner />
                Loading class detail...
              </div>
            ) : isEditMode && isDetailError ? (
              <p className="text-sm text-muted-foreground">
                Unable to load class detail.
              </p>
            ) : isEditMode && detailResponse ? (
              <EditClassForm
                classId={detailResponse.data.id}
                data={detailResponse.data}
                onCancel={() => router.push(classListHref)}
              />
            ) : (
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="grid gap-5 md:grid-cols-2"
                >
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Class Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="institutionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter institution name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter academic year (YYYY/YYYY)"
                            value={field.value ?? ""}
                            onChange={(event) => {
                              field.onChange(
                                formatAcademicYearInput(event.target.value),
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="classLevel"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Class Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select class level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CLASS_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                Grade {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter class description"
                            className="min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 border-t pt-5 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(classListHref)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createClassMutation.isPending}>
                      {createClassMutation.isPending ? "Creating..." : "Create Class"}
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
            <CardDescription>Guidelines for class setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Keep class names clear and easy to identify.</p>
            <p>- Use academic year format YYYY/YYYY.</p>
            <p>- Add a short description to explain class context.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
