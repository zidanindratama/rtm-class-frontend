import { ClassForumsPage } from "@/components/dashboard/forums/class-forums-page";

export default async function MyClassForumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ClassForumsPage
      classId={id}
      backHref={`/dashboard/my-class/${id}`}
      backLabel="Back to class detail"
    />
  );
}
