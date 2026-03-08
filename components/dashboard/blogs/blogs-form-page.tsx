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
  FormDescription,
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
import { Spinner } from "@/components/ui/spinner";
import { type APISingleResponse } from "@/types/api-response";
import {
  CreateBlogPayload,
  UpdateBlogPayload,
  type BlogDetailResponse,
} from "./blog-types";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { cn } from "@/lib/utils";
import { UploadResponseData, useUploadFile } from "@/hooks/use-upload-file";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  excerpt: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const editBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type CreateBlogValues = z.infer<typeof createBlogSchema>;
type EditBlogValues = z.infer<typeof editBlogSchema>;

type BlogFormPageProps =
  | { mode: "create"; blogId?: never }
  | { mode: "edit"; blogId: string };

export function BlogFormPage({ mode, blogId }: BlogFormPageProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const uploadMutation = useUploadFile<UploadResponseData>({
    endpoint: "/uploads",
    fileFieldName: "file",
    successMessage: "File uploaded successfully.",
    errorMessage: "Failed to upload file.",
  });

  const handleEditorUpload = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed.");
    }

    const result = await uploadMutation.uploadFile(file);
    return result.url;
  };

  const createForm = useForm<CreateBlogValues>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      isPublished: false,
    },
  });

  const editForm = useForm<EditBlogValues>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      isPublished: false,
    },
  });

  const {
    data: detailResponse,
    isLoading: isLoadingBlog,
    isError: isDetailError,
  } = useGetData<APISingleResponse<BlogDetailResponse>>({
    key: ["admin", "blogs", "detail", blogId],
    endpoint: `/admin/blogs/${blogId}`,
    extractData: false,
    enabled: isEditMode && Boolean(blogId),
    errorMessage: "Failed to load blog detail.",
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (!detailResponse?.data) {
      return;
    }

    editForm.reset({
      title: detailResponse.data.title ?? "",
      content: detailResponse.data.content ?? "",
      excerpt: detailResponse.data.excerpt ?? "",
      isPublished: detailResponse.data.isPublished ?? false,
    });
  }, [detailResponse?.data, editForm, isEditMode]);

  const createBlogMutation = usePostData<unknown, CreateBlogPayload>({
    key: ["admin", "blogs", "create"],
    endpoint: "/admin/blogs",
    successMessage: "Blog created successfully.",
    errorMessage: "Failed to create blog.",
    invalidateKeys: [["admin", "blogs"]],
    options: {
      onSuccess: () => router.push("/dashboard/blogs"),
    },
  });

  const updateBlogMutation = usePatchData<unknown, UpdateBlogPayload>({
    key: ["admin", "blogs", "update", blogId],
    endpoint: (blogId) => `/admin/blogs/${detailResponse?.data.id}`,
    successMessage: "Blog updated successfully.",
    errorMessage: "Failed to update blog.",
    invalidateKeys: [
      ["admin", "blogs"],
      ["admin", "blogs", "detail", blogId],
    ],
    options: {
      onSuccess: () => router.push("/dashboard/blogs"),
    },
  });

  const handleCreate = (values: CreateBlogValues) => {
    createBlogMutation.mutate({
      title: values.title,
      content: values.content,
      excerpt: values.excerpt,
      isPublished: values.isPublished,
    });
  };

  const handleEdit = (values: EditBlogValues) => {
    updateBlogMutation.mutate({
      title: values.title,
      content: values.content,
      excerpt: values.excerpt,
      isPublished: values.isPublished,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog list
          </Link>
          <h1 className="text-2xl mt-3 font-semibold tracking-tight">
            {isEditMode ? "Edit Blog" : "Create Blog"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update Blog account details and access status."
              : "Create a new Blog account with secure credentials."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 ">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blog Information</CardTitle>
            <CardDescription>
              Fill required fields below before saving changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode && isLoadingBlog ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                <Spinner />
                Loading Blog detail...
              </div>
            ) : isEditMode && isDetailError ? (
              <p className="text-sm text-muted-foreground">
                Unable to load Blog detail.
              </p>
            ) : isEditMode ? (
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEdit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog title"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog excerpt"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value === true ? "true" : "false"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">Draft</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Konten</FormLabel>{" "}
                        <FormDescription>
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Itaque eius quisquam quidem!
                        </FormDescription>
                        <FormControl>
                          <MinimalTiptapEditor
                            {...field}
                            value={field.value ?? ""}
                            throttleDelay={0}
                            className={cn("w-full min-h-150", {
                              "border-destructive focus-within:border-destructive":
                                createForm.formState.errors.content?.message,
                            })}
                            editorContentClassName="some-class"
                            editorClassName="focus:outline-hidden p-5"
                            placeholder="Write something..."
                            autofocus
                            uploader={handleEditorUpload}
                            editable
                            injectCSS
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/blogs")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateBlogMutation.isPending}
                    >
                      {updateBlogMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog title"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog excerpt"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value === true ? "true" : "false"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="false">Draft</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Konten</FormLabel>{" "}
                        <FormDescription>
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Itaque eius quisquam quidem!
                        </FormDescription>
                        <FormControl>
                          <MinimalTiptapEditor
                            {...field}
                            value={field.value ?? ""}
                            throttleDelay={0}
                            className={cn("w-full min-h-150", {
                              "border-destructive focus-within:border-destructive":
                                createForm.formState.errors.content?.message,
                            })}
                            editorContentClassName="some-class"
                            editorClassName="focus:outline-hidden p-5"
                            placeholder="Write something..."
                            autofocus
                            editable
                            uploader={handleEditorUpload}
                            injectCSS
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/blogs")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createBlogMutation.isPending}
                    >
                      {createBlogMutation.isPending ? "Saving..." : "Save"}
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
