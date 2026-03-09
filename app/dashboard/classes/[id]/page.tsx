import { ClassDetailPage } from "@/components/dashboard/classes/class-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ClassDetailPage classId={id} />;
}
