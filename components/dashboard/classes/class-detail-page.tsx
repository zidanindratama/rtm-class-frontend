"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  CalendarDays,
  Mail,
  MessageSquareText,
  School,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { APISingleResponse } from "@/types/api-response";
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
import { type AuthRole } from "@/routes/auth-keys";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";

type ClassDetailPageProps = {
  classId: string;
  backHref?: string;
  backLabel?: string;
  usageDescription?: string;
  enableStudentLeave?: boolean;
  membersHref?: string;
};

function formatDateLabel(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function ClassDetailPage({
  classId,
  backHref = "/dashboard/classes",
  backLabel = "Back to class list",
  usageDescription = "Use this page to monitor class health and members.",
  enableStudentLeave = false,
  membersHref,
}: ClassDetailPageProps) {
  const router = useRouter();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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
  const canLeaveClass = enableStudentLeave && currentRole === "STUDENT";
  const resolvedMembersHref =
    membersHref ?? `/dashboard/classes/${classId}/members`;

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
          href={backHref}
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

            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-background/80 p-3 backdrop-blur">
              <Button asChild size="sm">
                <Link href={resolvedMembersHref}>
                  Open Class Members
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {canLeaveClass ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setLeaveDialogOpen(true)}
                  disabled={leaveClassMutation.isPending}
                >
                  {leaveClassMutation.isPending
                    ? "Leaving..."
                    : "Leave Class"}
                </Button>
              ) : null}
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
    </section>
  );
}
