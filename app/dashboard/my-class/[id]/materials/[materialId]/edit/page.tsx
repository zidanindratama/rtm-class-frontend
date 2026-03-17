import { MaterialFormPage } from "@/components/dashboard/materials/material-form-page";
import { MaterialStudentDetailPage } from "@/components/dashboard/materials/material-student-detail-page";
import { cookies } from "next/headers";
import { USER_ROLE_KEY } from "@/routes/auth-keys";

export default async function MyClassMaterialEditPage({
  params,
}: {
  params: Promise<{ id: string; materialId: string }>;
}) {
  const { id, materialId } = await params;
  const role = (await cookies()).get(USER_ROLE_KEY)?.value;

  if (role === "STUDENT") {
    return <MaterialStudentDetailPage classId={id} materialId={materialId} />;
  }

  return (
    <MaterialFormPage mode="edit" classId={id} materialId={materialId} />
  );
}
