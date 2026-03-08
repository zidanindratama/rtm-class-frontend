 
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
import { ClassDetailResponse } from "./class-types";
import { classFormSchema, ClassFormValues } from "./class-form-page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACADEMIC_YEARS, CLASS_LEVELS } from "./class-constants";
export function EditClassForm({ 
  data, 
  onCancel 
}: { 
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

  const handleEdit = (values: ClassFormValues) => {
    // Intentionally left empty since the Patch API does not exist yet.
    console.log("Update payload ready for future API:", values);
  };

  return (
    <Form {...editForm}>
      <form
        onSubmit={editForm.handleSubmit(handleEdit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={editForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={editForm.control}
            name="institutionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Year — Select */}
          <FormField
            control={editForm.control}
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
          control={editForm.control}
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


        <FormField
          control={editForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4 items-center">
          <span className="text-xs text-muted-foreground mr-auto">
             * Updating functionality will be available soon.
          </span>
          <Button type="button" variant="outline" onClick={onCancel}>
            Back
          </Button>
          <Button type="submit" disabled>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}