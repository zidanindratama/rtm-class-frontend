import { StudentFormPage } from "@/components/dashboard/students/student-form-page";

type DashboardStudentEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardStudentEditPage({
  params,
}: DashboardStudentEditPageProps) {
  const { id } = await params;
  return <StudentFormPage mode="edit" studentId={id} />;
}
