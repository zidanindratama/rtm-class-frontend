import { ForumThreadDetailPage } from "@/components/dashboard/forums/forum-thread-detail-page";

export default async function MyClassForumThreadPage({
  params,
}: {
  params: Promise<{ id: string; threadId: string }>;
}) {
  const { id, threadId } = await params;

  return (
    <ForumThreadDetailPage
      classId={id}
      threadId={threadId}
      backHref={`/dashboard/my-class/${id}/forums`}
      backLabel="Back to class forum"
    />
  );
}
