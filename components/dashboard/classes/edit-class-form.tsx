import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassDetailResponse, CreateClassPayload } from "./class-types";
import { classFormSchema, ClassFormValues } from "./class-form-page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_LEVELS } from "./class-constants";
import { usePatchData } from "@/hooks/use-patch-data";

function formatAcademicYearInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, 4)}/${digits.slice(4)}`;
}

export function EditClassForm({
  classId,
  data,
  onCancel,
}: {
  classId: string;
  data: ClassDetailResponse;
  onCancel: () => void;
}) {
  const editForm = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: data.name || "",
      institutionName: data.institutionName || "",
      classLevel: data.classLevel || "",
      academicYear: data.academicYear || "",
      description: data.description || "",
    },
  });

  const updateClassMutation = usePatchData<unknown, CreateClassPayload>({
    key: ["admin", "classes", "update", classId],
    endpoint: `/classes/${classId}`,
    successMessage: "Class updated successfully.",
    errorMessage: "Failed to update class.",
    invalidateKeys: [
      ["admin", "classes"],
      ["admin", "classes", "detail", classId],
    ],
  });

  const handleEdit = (values: ClassFormValues) => {
    updateClassMutation.mutate({
      name: values.name,
      institutionName: values.institutionName || undefined,
      classLevel: values.classLevel || undefined,
      academicYear: values.academicYear || undefined,
      description: values.description || undefined,
    });
  };

  return (
    <Form {...editForm}>
      <form
        onSubmit={editForm.handleSubmit(handleEdit)}
        className="grid gap-5 md:grid-cols-2"
      >
        <FormField
          control={editForm.control}
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
          control={editForm.control}
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
          control={editForm.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter academic year (YYYY/YYYY)"
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(formatAcademicYearInput(event.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={editForm.control}
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
          control={editForm.control}
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

        <div className="flex items-center justify-end gap-2 border-t pt-5 md:col-span-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Back
          </Button>
          <Button type="submit" disabled={updateClassMutation.isPending}>
            {updateClassMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
