import { AssignmentEditPage } from "@/components/dashboard/assignments/assignment-edit-page";

export default async function MyClassAssignmentEditPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = await params;

  return <AssignmentEditPage classId={id} assignmentId={assignmentId} />;
}
