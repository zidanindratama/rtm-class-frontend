"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  GraduationCap,
  Mail,
  School,
  Search,
  ShieldCheck,
  UserMinus,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useDebounce } from "@/hooks/use-debounce";
import { APISingleResponse, APIListResponse } from "@/types/api-response";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { cn, formatDateLabel, getInitials } from "@/lib/utils";
import { authTokenStorage } from "@/lib/axios-instance";
import {
  ClassDetailResponse,
  ClassMemberResponse,
} from "@/components/dashboard/classes/class-types";

type ClassMembersPageProps = {
  classId: string;
  backHref: string;
  backLabel: string;
};

type MemberSortBy = "createdAt" | "fullName" | "email";
type MemberSortOrder = "asc" | "desc";

export function ClassMembersPage({
  classId,
  backHref,
  backLabel,
}: ClassMembersPageProps) {
  const role = authTokenStorage.getUserRole();
  const canManageMembers = role === "ADMIN" || role === "TEACHER";
  const canSuspendMembers = role === "ADMIN";

  const [memberSearch, setMemberSearch] = useState("");
  const [memberSortBy, setMemberSortBy] = useState<MemberSortBy>("createdAt");
  const [memberSortOrder, setMemberSortOrder] =
    useState<MemberSortOrder>("desc");
  const [memberPage, setMemberPage] = useState(1);
  const [memberPerPage, setMemberPerPage] = useState("24");
  const [memberPendingRemove, setMemberPendingRemove] =
    useState<ClassMemberResponse | null>(null);
  const [memberPendingSuspend, setMemberPendingSuspend] =
    useState<ClassMemberResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const debouncedMemberSearch = useDebounce(memberSearch, 350);

  const { data: classDetailResponse, isLoading: isLoadingClassDetail } =
    useGetData<APISingleResponse<ClassDetailResponse>>({
      key: ["admin", "classes", "detail", classId],
      endpoint: `/classes/${classId}`,
      extractData: false,
      errorMessage: "Failed to load class detail.",
    });

  const {
    data: classMembersResponse,
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = useGetData<APIListResponse<ClassMemberResponse>>({
    key: [
      "classes",
      "members",
      classId,
      {
        search: debouncedMemberSearch,
        sortBy: memberSortBy,
        sortOrder: memberSortOrder,
        page: memberPage,
        perPage: memberPerPage,
      },
    ],
    endpoint: `/classes/${classId}/members`,
    extractData: false,
    params: {
      page: memberPage,
      per_page: Number(memberPerPage),
      search: debouncedMemberSearch || undefined,
      sort_by: memberSortBy,
      sort_order: memberSortOrder,
    },
    errorMessage: "Failed to load class members.",
  });

  const removeMemberMutation = useDeleteData<unknown, { userId: string }>({
    key: ["classes", "remove-member", classId],
    endpoint: (variables) => `/classes/${classId}/members/${variables.userId}`,
    successMessage: "Student removed from class.",
    errorMessage: "Failed to remove student from class.",
    invalidateKeys: [
      ["classes", "members", classId],
      ["admin", "classes", "detail", classId],
      ["my-class"],
    ],
  });

  const suspendMemberMutation = usePatchData<
    unknown,
    { userId: string; suspended: boolean }
  >({
    key: ["users", "suspend-member", classId],
    endpoint: (variables) => `/admin/users/${variables.userId}/suspend`,
    successMessage: "Student suspend status updated.",
    errorMessage: "Failed to update suspend status.",
    invalidateKeys: [
      ["classes", "members", classId],
      ["admin", "classes", "detail", classId],
    ],
  });

  const classData = classDetailResponse?.data;
  const members = (classMembersResponse?.data ?? []).filter(
    (member) => member.role === "STUDENT",
  );

  const totalMembers =
    classMembersResponse?.meta?.total_items ?? members.length;
  const totalMemberPages = Math.max(
    1,
    classMembersResponse?.meta?.total_pages ?? 1,
  );
  const currentMemberPage =
    classMembersResponse?.meta?.current_page ?? memberPage;
  const visiblePageNumbers = Array.from(
    { length: totalMemberPages },
    (_, index) => index + 1,
  ).filter((pageNumber) => {
    if (totalMemberPages <= 7) return true;

    const isNearCurrent = Math.abs(pageNumber - currentMemberPage) <= 1;
    const isEdge = pageNumber <= 2 || pageNumber > totalMemberPages - 2;
    return isNearCurrent || isEdge;
  });

  const copyClassCode = async () => {
    if (!classData?.classCode) return;

    try {
      await navigator.clipboard.writeText(classData.classCode);
      setCopiedCode(true);
      toast.success("Class code copied.");
      window.setTimeout(() => setCopiedCode(false), 1200);
    } catch {
      toast.error("Failed to copy class code.");
    }
  };

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

        <h1 className="text-2xl font-semibold tracking-tight">Class Members</h1>
        <p className="text-sm text-muted-foreground">
          {classData
            ? `Students in ${classData.name} (${classData.classCode}).`
            : "Manage student members for this class."}
        </p>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Student Members</CardTitle>
          <CardDescription>
            Teachers are hidden here to keep member management focused on
            students.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <label className="relative block md:col-span-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={memberSearch}
                onChange={(event) => {
                  setMemberSearch(event.target.value);
                  setMemberPage(1);
                }}
                placeholder="Search students by name or email"
                className="pl-9"
              />
            </label>

            <Select
              value={memberSortBy}
              onValueChange={(value) => {
                setMemberSortBy(value as MemberSortBy);
                setMemberPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Joined Date</SelectItem>
                <SelectItem value="fullName">Full Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={memberSortOrder}
              onValueChange={(value) => {
                setMemberSortOrder(value as MemberSortOrder);
                setMemberPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {members.length} students (total records: {totalMembers})
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Per page</span>
              <Select
                value={memberPerPage}
                onValueChange={(value) => {
                  setMemberPerPage(value);
                  setMemberPage(1);
                }}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoadingClassDetail || isLoadingMembers ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Spinner />
              Loading class members...
            </div>
          ) : isMembersError ? (
            <p className="py-8 text-sm text-muted-foreground">
              Unable to load class members.
            </p>
          ) : members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No student members found on this page.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => (
                  <article
                    key={member.id}
                    className={cn(
                      "rounded-xl border bg-card/70 p-4 transition-colors",
                      member.user.isSuspended
                        ? "border-destructive/45"
                        : "border-border/70",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                        {getInitials(member.user.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {member.user.fullName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <p className="inline-flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Joined {formatDateLabel(member.createdAt)}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <UserRound className="h-3.5 w-3.5" />
                        Role: {member.user.role}
                      </p>
                      {member.user.isSuspended ? (
                        <p className="inline-flex items-center gap-2 text-destructive">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Suspended account
                        </p>
                      ) : null}
                    </div>

                    {canManageMembers ? (
                      <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
                        {canSuspendMembers ? (
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              member.user.isSuspended ? "secondary" : "outline"
                            }
                            onClick={() => setMemberPendingSuspend(member)}
                            disabled={suspendMemberMutation.isPending}
                          >
                            {member.user.isSuspended ? "Unsuspend" : "Suspend"}
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => setMemberPendingRemove(member)}
                          disabled={removeMemberMutation.isPending}
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 border-t pt-4">
                <button
                  type="button"
                  disabled={currentMemberPage <= 1}
                  onClick={() =>
                    setMemberPage((currentPage) => Math.max(1, currentPage - 1))
                  }
                  className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {visiblePageNumbers.map((pageNumber, index) => {
                  const previous = visiblePageNumbers[index - 1];
                  const needGap = previous && pageNumber - previous > 1;

                  return (
                    <div key={pageNumber} className="contents">
                      {needGap ? (
                        <span className="px-1 text-sm text-muted-foreground">
                          ...
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setMemberPage(pageNumber)}
                        className={cn(
                          "h-9 min-w-9 rounded-md border px-3 text-sm transition-colors",
                          currentMemberPage === pageNumber
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/70 hover:border-primary/40",
                        )}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  disabled={currentMemberPage >= totalMemberPages}
                  onClick={() =>
                    setMemberPage((currentPage) =>
                      Math.min(totalMemberPages, currentPage + 1),
                    )
                  }
                  className="h-9 rounded-md border border-border/70 px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteDialog
        open={Boolean(memberPendingRemove)}
        onOpenChange={(open) => {
          if (!open) setMemberPendingRemove(null);
        }}
        title="Remove student from class?"
        description={
          memberPendingRemove
            ? `${memberPendingRemove.user.fullName} will lose access to this class.`
            : ""
        }
        confirmText="Remove"
        onConfirm={() => {
          if (!memberPendingRemove) return;

          const userId = memberPendingRemove.user.id;
          setMemberPendingRemove(null);
          removeMemberMutation.mutate({ userId });
        }}
      />

      <DeleteDialog
        open={Boolean(memberPendingSuspend)}
        onOpenChange={(open) => {
          if (!open) setMemberPendingSuspend(null);
        }}
        title={
          memberPendingSuspend?.user.isSuspended
            ? "Unsuspend student account?"
            : "Suspend student account?"
        }
        description={
          memberPendingSuspend
            ? memberPendingSuspend.user.isSuspended
              ? `${memberPendingSuspend.user.fullName} will regain access after unsuspending.`
              : `${memberPendingSuspend.user.fullName} will not be able to sign in while suspended.`
            : ""
        }
        confirmText={
          memberPendingSuspend?.user.isSuspended ? "Unsuspend" : "Suspend"
        }
        onConfirm={() => {
          if (!memberPendingSuspend) return;

          const userId = memberPendingSuspend.user.id;
          const suspended = !memberPendingSuspend.user.isSuspended;
          setMemberPendingSuspend(null);
          suspendMemberMutation.mutate({ userId, suspended });
        }}
      />
    </section>
  );
}
