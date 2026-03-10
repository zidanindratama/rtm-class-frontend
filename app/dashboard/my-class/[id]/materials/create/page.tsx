import { MaterialFormPage } from "@/components/dashboard/materials/material-form-page";

export default async function MyClassCreateMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MaterialFormPage mode="create" classId={id} />;
}
