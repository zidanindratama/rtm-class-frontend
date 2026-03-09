import { ClassDetailPage } from "@/components/dashboard/classes/class-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ClassDetailPage
      classId={id}
      backHref="/dashboard/my-class"
      backLabel="Back to my classes"
      usageDescription="No class description yet. Add context so teachers and students can understand this class quickly."
      enableStudentLeave
      membersHref={`/dashboard/my-class/${id}/members`}
      showForumButton
      forumsHref={`/dashboard/my-class/${id}/forums`}
      showAssignmentsButton
      assignmentsHref={`/dashboard/my-class/${id}/assignments`}
    />
  );
}
