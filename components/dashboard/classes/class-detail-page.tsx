"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  ClipboardCheck,
  Copy,
  CalendarDays,
  FilePenLine,
  LogOut,
  Mail,
  MessageSquareText,
  School,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { APISingleResponse } from "@/types/api-response";
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
import { Spinner } from "@/components/ui/spinner";
import { authTokenStorage } from "@/lib/axios-instance";
import { formatDateLabel } from "@/lib/utils";
import { type AuthRole } from "@/routes/auth-keys";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";

type ClassDetailPageProps = {
  classId: string;
  backHref?: string;
  backLabel?: string;
  usageDescription?: string;
  enableStudentLeave?: boolean;
  membersHref?: string;
  showForumButton?: boolean;
  forumsHref?: string;
  showAssignmentsButton?: boolean;
  assignmentsHref?: string;
  showMaterialsButton?: boolean;
  materialsHref?: string;
};

export function ClassDetailPage({
  classId,
  backHref,
  backLabel = "Back to class list",
  usageDescription = "Use this page to monitor class health and members.",
  enableStudentLeave = false,
  membersHref,
  showForumButton = false,
  forumsHref,
  showAssignmentsButton = false,
  assignmentsHref,
  showMaterialsButton = false,
  materialsHref,
}: ClassDetailPageProps) {
  const router = useRouter();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: classDetailResponse,
    isLoading: isLoadingClassDetail,
    isError: isClassDetailError,
  } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["admin", "classes", "detail", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const leaveClassMutation = usePostData<unknown, Record<string, never>>({
    key: ["classes", "leave", classId],
    endpoint: `/classes/${classId}/leave`,
    successMessage: "You left the class successfully.",
    errorMessage: "Failed to leave class.",
    invalidateKeys: [["my-class"], ["admin", "classes"]],
    options: {
      onSuccess: () => {
        router.replace("/dashboard/my-class");
      },
    },
  });
  const deleteClassMutation = useDeleteData<unknown, { id: string }>({
    key: ["classes", "delete", classId],
    endpoint: (variables) => `/classes/${variables.id}`,
    successMessage: "Class deleted successfully.",
    errorMessage: "Failed to delete class.",
    invalidateKeys: [["my-class"], ["admin", "classes"]],
    options: {
      onSuccess: () => {
        const role = authTokenStorage.getUserRole();
        if (role === "ADMIN") {
          router.replace("/dashboard/classes");
          return;
        }
        router.replace("/dashboard/my-class");
      },
    },
  });

  if (isLoadingClassDetail) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="py-10">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              Loading class detail...
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isClassDetailError || !classDetailResponse?.data) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Unable to load class detail.
          </CardContent>
        </Card>
      </section>
    );
  }

  const classData = classDetailResponse.data;
  const currentRole: AuthRole | null = authTokenStorage.getUserRole();
  const isTeacher = currentRole === "TEACHER";
  const resolvedBackHref =
    backHref ?? (isTeacher ? "/dashboard/my-class" : "/dashboard/classes");
  const canLeaveClass = enableStudentLeave && currentRole === "STUDENT";
  const canManageClass = currentRole === "ADMIN" || currentRole === "TEACHER";
  const resolvedMembersHref =
    membersHref ??
    (isTeacher
      ? `/dashboard/my-class/${classId}/members`
      : `/dashboard/classes/${classId}/members`);
  const resolvedForumsHref = forumsHref ?? `/dashboard/my-class/${classId}/forums`;
  const resolvedAssignmentsHref =
    assignmentsHref ?? `/dashboard/my-class/${classId}/assignments`;
  const resolvedMaterialsHref =
    materialsHref ?? `/dashboard/my-class/${classId}/materials`;
  const canOpenForum = showForumButton || isTeacher;
  const canOpenAssignments = showAssignmentsButton || isTeacher;
  const canOpenMaterials = showMaterialsButton || isTeacher;

  const stats = [
    {
      label: "Total Members",
      value: classData._count?.members ?? 0,
      helper: "All active participants",
      icon: Users,
    },
    {
      label: "Forum Threads",
      value: classData._count?.forumThreads ?? 0,
      helper: "Ongoing class discussions",
      icon: MessageSquareText,
    },
    {
      label: "Created",
      value: formatDateLabel(classData.createdAt),
      helper: classData.updatedAt
        ? `Updated ${formatDateLabel(classData.updatedAt)}`
        : "No recent updates",
      icon: CalendarDays,
    },
  ];

  const copyClassCode = async () => {
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
          href={resolvedBackHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      <Card className="overflow-hidden border-border/70">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.10),transparent_50%)]" />
          <div className="relative space-y-4 px-6 py-6 md:px-8 md:py-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {classData.academicYear || "Year not set"}
              </Badge>
              <Badge variant="outline">
                {classData.classLevel
                  ? `Grade ${classData.classLevel}`
                  : "Level not set"}
              </Badge>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {classData.name}
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {classData.description?.trim() || usageDescription}
            </p>

            <div className="rounded-lg border border-border/70 bg-background/80 p-3 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Quick Actions
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Link
                  href={resolvedMembersHref}
                  className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">Class Members</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    View and manage student members in this class.
                  </p>
                </Link>

                {canOpenForum ? (
                  <Link
                    href={resolvedForumsHref}
                    className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <MessageSquareText className="h-5 w-5 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">Class Forum</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Open discussions, threads, and class collaboration.
                    </p>
                  </Link>
                ) : null}

                {canOpenAssignments ? (
                  <Link
                    href={resolvedAssignmentsHref}
                    className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">Assignments</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Open tasks, submission status, and grading details.
                    </p>
                  </Link>
                ) : null}

                {canOpenMaterials ? (
                  <Link
                    href={resolvedMaterialsHref}
                    className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <BookOpenText className="h-5 w-5 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">Materials</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Access class resources and learning files.
                    </p>
                  </Link>
                ) : null}

                {canLeaveClass ? (
                  <button
                    type="button"
                    onClick={() => setLeaveDialogOpen(true)}
                    disabled={leaveClassMutation.isPending}
                    className="group rounded-xl border border-destructive/35 bg-destructive/[0.04] p-4 text-left transition-colors hover:border-destructive/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <LogOut className="h-5 w-5 text-destructive" />
                      <ArrowRight className="h-4 w-4 text-destructive/70 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-destructive">
                      {leaveClassMutation.isPending ? "Leaving..." : "Leave Class"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Exit this class and return to your class list.
                    </p>
                  </button>
                ) : null}

                {canManageClass ? (
                  <Link
                    href={`/dashboard/classes/${classId}/edit`}
                    className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <FilePenLine className="h-5 w-5 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">Edit Class</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Update class title, level, institution, year, and description.
                    </p>
                  </Link>
                ) : null}

              </div>
            </div>

            <div className="grid gap-3 pt-1 md:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                <p className="text-xs text-muted-foreground">Class Code</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="font-mono text-base font-semibold tracking-[0.16em] text-primary">
                    {classData.classCode}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyClassCode}
                    className="shrink-0"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Institution</p>
                <p className="mt-1 inline-flex items-center gap-2 font-medium">
                  <School className="h-4 w-4" />
                  {classData.institutionName || "Not set"}
                </p>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Class Teacher</p>
                <p className="mt-1 font-medium">
                  {classData.teacher?.fullName || "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {classData.teacher?.email || "No email"}
                </p>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Teacher Contact
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4" />
                  {classData.teacher?.email || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="border-border/70">
              <CardHeader className="pb-1">
                <CardDescription className="inline-flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </CardDescription>
                <CardTitle className="text-2xl tracking-tight">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{item.helper}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {leaveDialogOpen ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Leave this class?
            </CardTitle>
            <CardDescription>
              You will be removed from this class and need a new class code to
              join again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLeaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setLeaveDialogOpen(false);
                leaveClassMutation.mutate({});
              }}
              disabled={leaveClassMutation.isPending}
            >
              Confirm Leave
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {canManageClass ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete this class and all related content. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteClassMutation.isPending}
            >
              {deleteClassMutation.isPending ? "Deleting..." : "Delete Class"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete class?"
        description="This action cannot be undone. The class and related data will be removed permanently."
        confirmText="Delete"
        onConfirm={() => {
          setDeleteDialogOpen(false);
          deleteClassMutation.mutate({ id: classId });
        }}
      />
    </section>
  );
}
