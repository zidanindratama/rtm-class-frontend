import { ClassFormPage } from "@/components/dashboard/classes/class-form-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClassFormPage mode="edit" classId={id} />;
}
