import { MaterialFormPage } from "@/components/dashboard/materials/material-form-page";

export default async function MyClassMaterialEditPage({
  params,
}: {
  params: Promise<{ id: string; materialId: string }>;
}) {
  const { id, materialId } = await params;

  return (
    <MaterialFormPage mode="edit" classId={id} materialId={materialId} />
  );
}
