"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Pencil,
  Reply,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { APISingleResponse } from "@/types/api-response";
import { authTokenStorage } from "@/lib/axios-instance";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ForumThreadDetail, ForumThreadDetailComment } from "./forum-types";

type ForumThreadDetailPageProps = {
  classId: string;
  threadId: string;
  backHref: string;
  backLabel: string;
};

type AuthMeResponseData = {
  user: {
    id: string;
  };
};

function formatDateTimeLabel(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ForumThreadDetailPage({
  classId,
  threadId,
  backHref,
  backLabel,
}: ForumThreadDetailPageProps) {
  const router = useRouter();
  const role = authTokenStorage.getUserRole();
  const [newComment, setNewComment] = useState("");
  const [editingThreadOpen, setEditingThreadOpen] = useState(false);
  const [editThreadTitle, setEditThreadTitle] = useState("");
  const [editThreadContent, setEditThreadContent] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [pendingDeleteThread, setPendingDeleteThread] = useState(false);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<string | null>(null);

  const { data: meData } = useGetData<AuthMeResponseData>({
    key: ["auth", "me", "forum-thread", threadId],
    endpoint: "/auth/me",
    enabled: Boolean(authTokenStorage.getAccessToken()),
    errorMessage: "Failed to load account data.",
  });

  const {
    data: threadResponse,
    isLoading,
    isError,
  } = useGetData<APISingleResponse<ForumThreadDetail>>({
    key: ["forums", "thread", "detail", threadId],
    endpoint: `/forums/threads/${threadId}`,
    extractData: false,
    errorMessage: "Failed to load thread detail.",
  });

  const createCommentMutation = usePostData<unknown, { content: string }>({
    key: ["forums", "comment", "create", threadId],
    endpoint: `/forums/threads/${threadId}/comments`,
    successMessage: "Comment posted.",
    errorMessage: "Failed to post comment.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
    options: {
      onSuccess: () => setNewComment(""),
    },
  });

  const replyMutation = usePostData<unknown, { commentId: string; content: string }>({
    key: ["forums", "comment", "reply", threadId],
    endpoint: (variables) => `/forums/comments/${variables.commentId}/replies`,
    successMessage: "Reply posted.",
    errorMessage: "Failed to post reply.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
    options: {
      onSuccess: () => {
        setReplyToCommentId(null);
        setReplyContent("");
      },
    },
  });

  const upvoteThreadMutation = usePostData<unknown, Record<string, never>>({
    key: ["forums", "thread", "upvote", threadId],
    endpoint: `/forums/threads/${threadId}/upvote`,
    successMessage: "",
    errorMessage: "Failed to update thread upvote.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
  });

  const upvoteCommentMutation = usePostData<unknown, { commentId: string }>({
    key: ["forums", "comment", "upvote", threadId],
    endpoint: (variables) => `/forums/comments/${variables.commentId}/upvote`,
    successMessage: "",
    errorMessage: "Failed to update comment upvote.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
  });

  const updateThreadMutation = usePatchData<
    unknown,
    { title?: string; content?: string }
  >({
    key: ["forums", "thread", "update", threadId],
    endpoint: `/forums/threads/${threadId}`,
    successMessage: "Thread updated successfully.",
    errorMessage: "Failed to update thread.",
    invalidateKeys: [["forums", "thread", "detail", threadId], ["forums", "threads", classId]],
    options: {
      onSuccess: () => setEditingThreadOpen(false),
    },
  });

  const updateCommentMutation = usePatchData<unknown, { commentId: string; content: string }>({
    key: ["forums", "comment", "update", threadId],
    endpoint: (variables) => `/forums/comments/${variables.commentId}`,
    successMessage: "Comment updated.",
    errorMessage: "Failed to update comment.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
    options: {
      onSuccess: () => {
        setEditingCommentId(null);
        setEditingCommentContent("");
      },
    },
  });

  const deleteThreadMutation = useDeleteData<unknown, Record<string, never>>({
    key: ["forums", "thread", "delete", threadId],
    endpoint: `/forums/threads/${threadId}`,
    successMessage: "Thread deleted.",
    errorMessage: "Failed to delete thread.",
    invalidateKeys: [["forums", "threads", classId]],
    options: {
      onSuccess: () => {
        router.replace(backHref);
      },
    },
  });

  const deleteCommentMutation = useDeleteData<unknown, { commentId: string }>({
    key: ["forums", "comment", "delete", threadId],
    endpoint: (variables) => `/forums/comments/${variables.commentId}`,
    successMessage: "Comment deleted.",
    errorMessage: "Failed to delete comment.",
    invalidateKeys: [["forums", "thread", "detail", threadId]],
  });

  const thread = threadResponse?.data;
  const currentUserId = meData?.user.id;
  const canManageThread = Boolean(
    thread &&
      (role === "ADMIN" || (currentUserId && currentUserId === thread.authorId)),
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">
            Loading thread detail...
          </CardContent>
        </Card>
      ) : isError || !thread ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">
            Unable to load thread detail.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border/70">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{thread.title}</CardTitle>
                  <CardDescription className="mt-1">
                    By {thread.author.fullName} in {thread.classroom.name} ({thread.classroom.classCode})
                  </CardDescription>
                </div>
                <Badge variant="outline">{formatDateTimeLabel(thread.createdAt)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {thread.content}
              </p>

              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <Button
                  type="button"
                  size="sm"
                  variant={thread.upvotedByMe ? "default" : "outline"}
                  onClick={() => upvoteThreadMutation.mutate({})}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {thread.upvoteCount}
                </Button>

                {canManageThread ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingThreadOpen(true);
                        setEditThreadTitle(thread.title);
                        setEditThreadContent(thread.content);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Thread
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => setPendingDeleteThread(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Thread
                    </Button>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {editingThreadOpen ? (
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Edit Thread</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={editThreadTitle}
                  onChange={(event) => setEditThreadTitle(event.target.value)}
                  placeholder="Thread title"
                />
                <Textarea
                  value={editThreadContent}
                  onChange={(event) => setEditThreadContent(event.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingThreadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      updateThreadMutation.mutate({
                        title: editThreadTitle.trim(),
                        content: editThreadContent.trim(),
                      })
                    }
                    disabled={
                      updateThreadMutation.isPending ||
                      editThreadTitle.trim().length < 3 ||
                      editThreadContent.trim().length < 3
                    }
                  >
                    {updateThreadMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
              <CardDescription>Ask, answer, and continue the discussion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                <Textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[90px]"
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => createCommentMutation.mutate({ content: newComment.trim() })}
                    disabled={createCommentMutation.isPending || newComment.trim().length < 1}
                  >
                    <Send className="h-4 w-4" />
                    {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>

              {thread.comments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {thread.comments.map((comment) => (
                    <CommentNode
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId ?? null}
                      role={role}
                      editingCommentId={editingCommentId}
                      editingCommentContent={editingCommentContent}
                      setEditingCommentId={setEditingCommentId}
                      setEditingCommentContent={setEditingCommentContent}
                      onSaveEdit={(commentId) =>
                        updateCommentMutation.mutate({
                          commentId,
                          content: editingCommentContent.trim(),
                        })
                      }
                      onDelete={(commentId) => setPendingDeleteCommentId(commentId)}
                      onUpvote={(commentId) => upvoteCommentMutation.mutate({ commentId })}
                      replyToCommentId={replyToCommentId}
                      setReplyToCommentId={setReplyToCommentId}
                      replyContent={replyContent}
                      setReplyContent={setReplyContent}
                      onSubmitReply={(commentId) =>
                        replyMutation.mutate({ commentId, content: replyContent.trim() })
                      }
                      isReplySubmitting={replyMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <DeleteDialog
        open={pendingDeleteThread}
        onOpenChange={setPendingDeleteThread}
        title="Delete this thread?"
        description="This thread and all related comments will be permanently removed."
        confirmText="Delete"
        onConfirm={() => {
          deleteThreadMutation.mutate({});
        }}
      />

      <DeleteDialog
        open={Boolean(pendingDeleteCommentId)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteCommentId(null);
        }}
        title="Delete this comment?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          if (!pendingDeleteCommentId) return;

          const commentId = pendingDeleteCommentId;
          setPendingDeleteCommentId(null);
          deleteCommentMutation.mutate({ commentId });
        }}
      />
    </section>
  );
}

type CommentNodeProps = {
  comment: ForumThreadDetailComment;
  currentUserId: string | null;
  role: "ADMIN" | "TEACHER" | "STUDENT" | null;
  editingCommentId: string | null;
  editingCommentContent: string;
  setEditingCommentId: (value: string | null) => void;
  setEditingCommentContent: (value: string) => void;
  onSaveEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onUpvote: (commentId: string) => void;
  replyToCommentId: string | null;
  setReplyToCommentId: (value: string | null) => void;
  replyContent: string;
  setReplyContent: (value: string) => void;
  onSubmitReply: (commentId: string) => void;
  isReplySubmitting: boolean;
  depth?: number;
};

function CommentNode({
  comment,
  currentUserId,
  role,
  editingCommentId,
  editingCommentContent,
  setEditingCommentId,
  setEditingCommentContent,
  onSaveEdit,
  onDelete,
  onUpvote,
  replyToCommentId,
  setReplyToCommentId,
  replyContent,
  setReplyContent,
  onSubmitReply,
  isReplySubmitting,
  depth = 0,
}: CommentNodeProps) {
  const canManage = role === "ADMIN" || (currentUserId && currentUserId === comment.authorId);
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyToCommentId === comment.id;

  return (
    <article className={`${depth > 0 ? "ml-5 border-l pl-4" : ""}`}>
      <div className="rounded-xl border border-border/70 bg-background/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{comment.author.fullName}</p>
            <p className="text-xs text-muted-foreground">{formatDateTimeLabel(comment.createdAt)}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={comment.upvotedByMe ? "default" : "outline"}
            onClick={() => onUpvote(comment.id)}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {comment.upvoteCount}
          </Button>
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-2">
            <Textarea
              value={editingCommentContent}
              onChange={(event) => setEditingCommentContent(event.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditingCommentContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onSaveEdit(comment.id)}
                disabled={editingCommentContent.trim().length < 1}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{comment.content}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setReplyToCommentId(isReplying ? null : comment.id);
              setReplyContent("");
            }}
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </Button>

          {canManage ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditingCommentContent(comment.content);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onDelete(comment.id)}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          ) : null}
        </div>

        {isReplying ? (
          <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-muted/10 p-3">
            <Textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyToCommentId(null);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => onSubmitReply(comment.id)}
                disabled={isReplySubmitting || replyContent.trim().length < 1}
              >
                {isReplySubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              role={role}
              editingCommentId={editingCommentId}
              editingCommentContent={editingCommentContent}
              setEditingCommentId={setEditingCommentId}
              setEditingCommentContent={setEditingCommentContent}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              onUpvote={onUpvote}
              replyToCommentId={replyToCommentId}
              setReplyToCommentId={setReplyToCommentId}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={onSubmitReply}
              isReplySubmitting={isReplySubmitting}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
