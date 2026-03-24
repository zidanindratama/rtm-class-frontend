"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  ThumbsUp,
  Trash2,
  UserRound,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authTokenStorage } from "@/lib/axios-instance";
import { formatDateLabel } from "@/lib/utils";
import { ForumThreadFormPayload, ForumThreadListItem } from "./forum-types";

type ClassForumsPageProps = {
  classId: string;
  backHref: string;
  backLabel: string;
};

type AuthMeResponseData = {
  user: {
    id: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
  };
};

type ForumSortBy = "createdAt" | "title";
type ForumSortOrder = "asc" | "desc";

export function ClassForumsPage({
  classId,
  backHref,
  backLabel,
}: ClassForumsPageProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ForumSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<ForumSortOrder>("desc");
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [editingThread, setEditingThread] = useState<ForumThreadListItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [pendingDeleteThread, setPendingDeleteThread] =
    useState<ForumThreadListItem | null>(null);

  const role = authTokenStorage.getUserRole();

  const { data: meData } = useGetData<AuthMeResponseData>({
    key: ["auth", "me", "forums"],
    endpoint: "/auth/me",
    enabled: Boolean(authTokenStorage.getAccessToken()),
    errorMessage: "Failed to load account data.",
  });

  const { data: classDetailResponse } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["class-forums", "class", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const {
    data: threadsResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<ForumThreadListItem>>({
    key: ["forums", "threads", classId, { search, sortBy, sortOrder, page }],
    endpoint: "/forums/threads",
    extractData: false,
    params: {
      classId,
      page,
      per_page: 8,
      search: search.trim() || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
    errorMessage: "Failed to load forum threads.",
  });

  const createThreadMutation = usePostData<unknown, ForumThreadFormPayload>({
    key: ["forums", "thread", "create", classId],
    endpoint: "/forums/threads",
    successMessage: "Thread created successfully.",
    errorMessage: "Failed to create thread.",
    invalidateKeys: [["forums", "threads", classId], ["classes", classId]],
    options: {
      onSuccess: () => {
        setShowCreateForm(false);
        setNewThreadTitle("");
        setNewThreadContent("");
        setPage(1);
      },
    },
  });

  const updateThreadMutation = usePatchData<
    unknown,
    { threadId: string; title?: string; content?: string }
  >({
    key: ["forums", "thread", "update", classId],
    endpoint: (variables) => `/forums/threads/${variables.threadId}`,
    successMessage: "Thread updated successfully.",
    errorMessage: "Failed to update thread.",
    invalidateKeys: [["forums", "threads", classId]],
    options: {
      onSuccess: () => {
        setEditingThread(null);
        setEditTitle("");
        setEditContent("");
      },
    },
  });

  const deleteThreadMutation = useDeleteData<unknown, { threadId: string }>({
    key: ["forums", "thread", "delete", classId],
    endpoint: (variables) => `/forums/threads/${variables.threadId}`,
    successMessage: "Thread deleted successfully.",
    errorMessage: "Failed to delete thread.",
    invalidateKeys: [["forums", "threads", classId]],
  });

  const upvoteThreadMutation = usePostData<unknown, { threadId: string }>({
    key: ["forums", "thread", "upvote", classId],
    endpoint: (variables) => `/forums/threads/${variables.threadId}/upvote`,
    successMessage: "",
    errorMessage: "Failed to update upvote.",
    invalidateKeys: [["forums", "threads", classId]],
  });

  const classData = classDetailResponse?.data;
  const threads = threadsResponse?.data ?? [];
  const totalPages = Math.max(1, threadsResponse?.meta?.total_pages ?? 1);
  const currentPage = threadsResponse?.meta?.current_page ?? page;
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const currentUserId = meData?.user.id;

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

        <h1 className="text-2xl font-semibold tracking-tight">Class Forum</h1>
        <p className="text-sm text-muted-foreground">
          {classData
            ? `Discuss topics in ${classData.name} (${classData.classCode}).`
            : "Collaborate through discussion threads in this class."}
        </p>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Forum Controls</CardTitle>
          <CardDescription>
            Search and organize discussions, then create threads when needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <label className="relative block md:col-span-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search thread title or content"
                className="pl-9"
              />
            </label>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as ForumSortBy);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value) => {
                setSortOrder(value as ForumSortOrder);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Showing {threads.length} thread{threads.length === 1 ? "" : "s"} on this page.
            </p>
            <Button
              type="button"
              onClick={() => setShowCreateForm((open) => !open)}
              variant={showCreateForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Close Form" : "Create Thread"}
            </Button>
          </div>

          {showCreateForm ? (
            <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
              <Input
                value={newThreadTitle}
                onChange={(event) => setNewThreadTitle(event.target.value)}
                placeholder="Thread title"
              />
              <Textarea
                value={newThreadContent}
                onChange={(event) => setNewThreadContent(event.target.value)}
                placeholder="Thread content"
                className="min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    createThreadMutation.mutate({
                      classId,
                      title: newThreadTitle.trim(),
                      content: newThreadContent.trim(),
                    })
                  }
                  disabled={
                    createThreadMutation.isPending ||
                    newThreadTitle.trim().length < 3 ||
                    newThreadContent.trim().length < 3
                  }
                >
                  {createThreadMutation.isPending ? "Creating..." : "Post Thread"}
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>Open a thread to read and reply to discussions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="py-8 text-sm text-muted-foreground">Loading threads...</p>
          ) : isError ? (
            <p className="py-8 text-sm text-muted-foreground">Unable to load threads.</p>
          ) : threads.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-8 text-center">
              <p className="text-sm text-muted-foreground">No threads found yet.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {threads.map((thread) => {
                  const canManageThread =
                    role === "ADMIN" || (currentUserId && currentUserId === thread.authorId);

                  return (
                    <article key={thread.id} className="rounded-xl border border-border/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold">{thread.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {thread.content}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {formatDateLabel(thread.createdAt)}
                        </Badge>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5" />
                          {thread.author.fullName}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {thread._count.comments} comment
                          {thread._count.comments === 1 ? "" : "s"}
                        </span>
                        <button
                          type="button"
                          onClick={() => upvoteThreadMutation.mutate({ threadId: thread.id })}
                          disabled={upvoteThreadMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 text-xs transition-colors hover:border-primary/40"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {thread._count.upvotes}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/my-class/${classId}/forums/${thread.id}`}>
                            Open Discussion
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>

                        {canManageThread ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingThread(thread);
                                setEditTitle(thread.title);
                                setEditContent(thread.content);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => setPendingDeleteThread(thread)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
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
      </Card>

      {editingThread ? (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Edit Thread</CardTitle>
            <CardDescription>Update your thread title and content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
            <Textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingThread(null);
                  setEditTitle("");
                  setEditContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() =>
                  updateThreadMutation.mutate({
                    threadId: editingThread.id,
                    title: editTitle.trim(),
                    content: editContent.trim(),
                  })
                }
                disabled={
                  updateThreadMutation.isPending ||
                  editTitle.trim().length < 3 ||
                  editContent.trim().length < 3
                }
              >
                {updateThreadMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <DeleteDialog
        open={Boolean(pendingDeleteThread)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteThread(null);
        }}
        title="Delete thread?"
        description={
          pendingDeleteThread
            ? `"${pendingDeleteThread.title}" and all related comments will be removed.`
            : ""
        }
        confirmText="Delete"
        onConfirm={() => {
          if (!pendingDeleteThread) return;

          const threadId = pendingDeleteThread.id;
          setPendingDeleteThread(null);
          deleteThreadMutation.mutate({ threadId });
        }}
      />
    </section>
  );
}
