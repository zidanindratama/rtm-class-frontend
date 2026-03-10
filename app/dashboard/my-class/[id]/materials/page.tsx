import { ClassMaterialsPage } from "@/components/dashboard/materials/class-materials-page";

export default async function MyClassMaterialsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ClassMaterialsPage
      classId={id}
      backHref={`/dashboard/my-class/${id}`}
      backLabel="Back to class detail"
    />
  );
}
