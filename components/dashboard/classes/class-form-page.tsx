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
import { CreateClassPayload, type ClassDetailResponse } from "./class-types";
import { EditClassForm } from "./edit-class-form";
import { ACADEMIC_YEARS, CLASS_LEVELS } from "./class-constants";

// ─── Zod Schema ────────────────────────────────────────────────────────────
export const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required."),
  institutionName: z.string().optional(),
  classLevel: z.string().optional(),
  academicYear: z.string().optional(),
  description: z.string().optional(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

type ClassFormPageProps =
  | { mode: "create"; classId?: never }
  | { mode: "edit"; classId: string };

export function ClassFormPage({ mode, classId }: ClassFormPageProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  // GET class detail (edit mode)
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

  // POST create class
  const createClassMutation = usePostData<unknown, CreateClassPayload>({
    key: ["admin", "classes", "create"],
    endpoint: "/classes",
    successMessage: "Class created successfully.",
    errorMessage: "Failed to create class.",
    invalidateKeys: [["admin", "classes"]],
    options: {
      onSuccess: () => router.push("/dashboard/classes"),
    },
  });

  // Form (create mode)
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
      institutionName: values.institutionName,
      classLevel: values.classLevel,
      academicYear: values.academicYear,
      description: values.description,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/classes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Class list
          </Link>
          <h1 className="text-2xl mt-3 font-semibold tracking-tight">
            {isEditMode ? "View / Edit Class" : "Create Class"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "View class details (Updating is coming soon)."
              : "Create a new class for your institution."}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>
              Fill out the details below. Only the class name is strictly
              required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode && isLoadingClass ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Spinner />
                Loading Class detail...
              </div>
            ) : isEditMode && isDetailError ? (
              <p className="text-sm text-muted-foreground">
                Unable to load Class detail.
              </p>
            ) : isEditMode && detailResponse ? (
              <EditClassForm
                data={detailResponse.data}
                onCancel={() => router.push("/dashboard/classes")}
              />
            ) : (
              // ── CREATE MODE ──────────────────────────────────────────────
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="flex flex-col gap-4"
                >
                  {/* Class Name */}
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Mathematics 10-A"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Institution Name */}
                    <FormField
                      control={createForm.control}
                      name="institutionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., SMA Negeri 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Academic Year — Select */}
                    <FormField
                      control={createForm.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select academic year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ACADEMIC_YEARS.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Class Level — Select */}
                  <FormField
                    control={createForm.control}
                    name="classLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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

                  {/* Description */}
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a brief description of the class..."
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/classes")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createClassMutation.isPending}
                    >
                      {createClassMutation.isPending
                        ? "Creating..."
                        : "Create Class"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
