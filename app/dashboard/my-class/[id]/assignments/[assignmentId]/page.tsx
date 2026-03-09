import { AssignmentDetailPage } from "@/components/dashboard/assignments/assignment-detail-page";

export default async function MyClassAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = await params;

  return (
    <AssignmentDetailPage
      classId={id}
      assignmentId={assignmentId}
      backHref={`/dashboard/my-class/${id}/assignments`}
      backLabel="Back to assignments"
    />
  );
}
