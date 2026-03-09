import { AssignmentWorkPage } from "@/components/dashboard/assignments/assignment-work-page";

export default async function MyClassAssignmentWorkPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = await params;

  return <AssignmentWorkPage classId={id} assignmentId={assignmentId} />;
}
