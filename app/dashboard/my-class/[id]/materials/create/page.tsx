import { MaterialFormPage } from "@/components/dashboard/materials/material-form-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_ROLE_KEY } from "@/routes/auth-keys";

export default async function MyClassCreateMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = (await cookies()).get(USER_ROLE_KEY)?.value;

  if (role === "STUDENT") {
    redirect(`/dashboard/my-class/${id}/materials`);
  }

  return <MaterialFormPage mode="create" classId={id} />;
}
