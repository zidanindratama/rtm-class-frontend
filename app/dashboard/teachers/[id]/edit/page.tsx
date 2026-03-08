import { TeacherFormPage } from "@/components/dashboard/teachers/teacher-form-page";

type DashboardTeacherEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardTeacherEditPage({
  params,
}: DashboardTeacherEditPageProps) {
  const { id } = await params;
  return <TeacherFormPage mode="edit" teacherId={id} />;
}
