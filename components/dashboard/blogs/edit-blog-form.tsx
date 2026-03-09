import { Button } from "@/components/ui/button";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editBlogSchema, type EditBlogValues } from "./blogs-form-page";
import { type BlogDetailResponse } from "./blog-types";

interface EditBlogFormProps {
  data: BlogDetailResponse;
  isPending: boolean;
  onSubmit: (values: EditBlogValues) => void;
  onCancel: () => void;
  handleEditorUpload: (file: File) => Promise<string>;
}

export function EditBlogForm({
  data,
  isPending,
  onSubmit,
  onCancel,
  handleEditorUpload,
}: EditBlogFormProps) {
  const form = useForm<EditBlogValues>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: data.title ?? "",
      content: data.content ?? "",
      excerpt: data.excerpt ?? "",
      isPublished: Boolean(data.isPublished),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Input placeholder="Enter excerpt" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
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
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Content</FormLabel>
              <FormDescription>
                Update the article content. You can format text and upload images.
              </FormDescription>
              <FormControl>
                <MinimalTiptapEditor
                  {...field}
                  value={field.value ?? ""}
                  throttleDelay={0}
                  className={cn("w-full min-h-150", {
                    "border-destructive focus-within:border-destructive":
                      form.formState.errors.content?.message,
                  })}
                  editorContentClassName="some-class"
                  editorClassName="focus:outline-hidden p-5"
                  placeholder="Write blog content..."
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

        <div className="flex justify-end gap-2 border-t pt-5 md:col-span-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
