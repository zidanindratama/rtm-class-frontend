import { ClassMembersPage } from "@/components/dashboard/classes/class-members-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ClassMembersPage
      classId={id}
      backHref={`/dashboard/my-class/${id}`}
      backLabel="Back to class detail"
    />
  );
}
