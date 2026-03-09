import { ClassAssignmentsPage } from "@/components/dashboard/assignments/class-assignments-page";

export default async function MyClassAssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ClassAssignmentsPage
      classId={id}
      backHref={`/dashboard/my-class/${id}`}
      backLabel="Back to class detail"
    />
  );
}
