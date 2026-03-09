import { AssignmentGradingPage } from "@/components/dashboard/assignments/assignment-grading-page";

export default async function MyClassAssignmentGradingPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = await params;

  return <AssignmentGradingPage classId={id} assignmentId={assignmentId} />;
}
