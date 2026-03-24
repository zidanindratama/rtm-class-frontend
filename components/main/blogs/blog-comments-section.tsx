"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MessageCircle, Reply, Send, Trash2 } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { authTokenStorage } from "@/lib/axios-instance";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTimeLabel, getInitials } from "@/lib/utils";
import {
  PublicBlogComment,
  PublicBlogCommentsResponse,
} from "./blog-public-types";

type BlogCommentsSectionProps = {
  slug: string;
};

type AuthMeResponseData = {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
};

export function BlogCommentsSection({ slug }: BlogCommentsSectionProps) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [newComment, setNewComment] = useState("");
  const [replyForCommentId, setReplyForCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [pendingDeleteComment, setPendingDeleteComment] =
    useState<PublicBlogComment | null>(null);

  const currentRole = authTokenStorage.getUserRole();
  const isAuthenticated = Boolean(authTokenStorage.getAccessToken());
  const isAdmin = currentRole === "ADMIN";

  const { data: meData } = useGetData<AuthMeResponseData>({
    key: ["auth", "me", "blog-comments"],
    endpoint: "/auth/me",
    enabled: isAuthenticated,
    errorMessage: "Failed to load your account info.",
  });

  const {
    data: commentsResponse,
    isLoading,
    isError,
  } = useGetData<PublicBlogCommentsResponse>({
    key: ["public", "blog-comments", slug, { page, sortOrder }],
    endpoint: `/blogs/${slug}/comments`,
    extractData: false,
    params: {
      page,
      per_page: 8,
      sort_order: sortOrder,
    },
    errorMessage: "Failed to load blog comments.",
  });

  const createCommentMutation = usePostData<unknown, { content: string }>({
    key: ["public", "blog-comments", "create", slug],
    endpoint: `/blogs/${slug}/comments`,
    successMessage: "Comment posted.",
    errorMessage: "Failed to post comment.",
    invalidateKeys: [["public", "blog-comments", slug]],
    options: {
      onSuccess: () => {
        setNewComment("");
        setPage(1);
      },
    },
  });

  const replyMutation = usePostData<
    unknown,
    { commentId: string; content: string }
  >({
    key: ["public", "blog-comments", "reply", slug],
    endpoint: (variables) => `/blogs/comments/${variables.commentId}/replies`,
    successMessage: "Reply posted.",
    errorMessage: "Failed to post reply.",
    invalidateKeys: [["public", "blog-comments", slug]],
    options: {
      onSuccess: () => {
        setReplyForCommentId(null);
        setReplyContent("");
      },
    },
  });

  const deleteCommentMutation = useDeleteData<unknown, { id: string }>({
    key: ["admin", "blogs", "comments", "delete"],
    endpoint: (variables) => `/admin/blogs/comments/${variables.id}`,
    successMessage: "Comment deleted successfully.",
    errorMessage: "Failed to delete comment.",
    invalidateKeys: [["public", "blog-comments", slug]],
  });

  const comments = commentsResponse?.data?.comments ?? [];
  const commentsMeta = commentsResponse?.meta;
  const totalPages = Math.max(1, commentsMeta?.total_pages ?? 1);
  const currentPage = commentsMeta?.current_page ?? page;
  const totalComments = commentsMeta?.total_items ?? comments.length;
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <Card id="comments" className="border-border/45 bg-card/65">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="inline-flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments
            </CardTitle>
            <CardDescription className="mt-1">
              {totalComments} conversation{totalComments === 1 ? "" : "s"} on this article.
            </CardDescription>
          </div>

          <div className="w-full sm:w-[190px]">
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                setSortOrder(value as "asc" | "desc");
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-2 rounded-xl border border-border/60 bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">
              Signed in as {meData?.user.fullName ?? "user"}
            </p>
            <Textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Write your comment..."
              maxLength={2000}
              className="min-h-[90px]"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => createCommentMutation.mutate({ content: newComment.trim() })}
                disabled={createCommentMutation.isPending || newComment.trim().length === 0}
              >
                <Send className="h-4 w-4" />
                {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
            Sign in to join the discussion.
            <Link
              href="/auth/sign-in"
              className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              Go to sign in
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">Unable to load comments.</p>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
            <p className="text-sm text-muted-foreground">No comments yet. Be the first one.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {getInitials(comment.author.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{comment.author.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTimeLabel(comment.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAuthenticated ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const isSameComment = replyForCommentId === comment.id;
                                setReplyForCommentId(isSameComment ? null : comment.id);
                                setReplyContent("");
                              }}
                            >
                              <Reply className="h-3.5 w-3.5" />
                              Reply
                            </Button>
                          ) : null}

                          {isAdmin ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setPendingDeleteComment(comment)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {comment.content}
                      </p>

                      {replyForCommentId === comment.id ? (
                        <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-background p-3">
                          <Textarea
                            value={replyContent}
                            onChange={(event) => setReplyContent(event.target.value)}
                            placeholder="Write your reply..."
                            maxLength={2000}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyForCommentId(null);
                                setReplyContent("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                replyMutation.mutate({
                                  commentId: comment.id,
                                  content: replyContent.trim(),
                                })
                              }
                              disabled={
                                replyMutation.isPending || replyContent.trim().length === 0
                              }
                            >
                              {replyMutation.isPending ? "Posting..." : "Post Reply"}
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {comment.replies.length > 0 ? (
                        <div className="mt-4 space-y-2 border-l border-border/70 pl-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="rounded-lg border border-border/55 bg-background/90 p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium">{reply.author.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDateTimeLabel(reply.createdAt)}
                                  </p>
                                </div>
                                {isAdmin ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                      setPendingDeleteComment({
                                        ...comment,
                                        id: reply.id,
                                        author: reply.author,
                                      })
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </Button>
                                ) : null}
                              </div>
                              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage <= 1}
                  className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 min-w-9 rounded-md border px-3 text-sm transition-colors ${
                      currentPage === pageNumber
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 hover:border-primary/40"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>

      <DeleteDialog
        open={Boolean(pendingDeleteComment)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteComment(null);
        }}
        title="Delete this comment?"
        description={
          pendingDeleteComment
            ? `This action cannot be undone. Comment by ${pendingDeleteComment.author.fullName} will be removed.`
            : ""
        }
        confirmText="Delete"
        onConfirm={() => {
          if (!pendingDeleteComment) return;

          const commentId = pendingDeleteComment.id;
          setPendingDeleteComment(null);
          deleteCommentMutation.mutate({ id: commentId });
        }}
      />
    </Card>
  );
}
