"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Mail,
  MessageSquareText,
  Search,
  School,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  ClassDetailResponse,
  ClassMemberResponse,
} from "@/components/dashboard/classes/class-types";

type ClassDetailPageProps = {
  classId: string;
};

type MemberSortBy = "createdAt" | "fullName" | "email";
type MemberSortOrder = "asc" | "desc";

function formatDateLabel(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ClassDetailPage({ classId }: ClassDetailPageProps) {
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSortBy, setMemberSortBy] = useState<MemberSortBy>("createdAt");
  const [memberSortOrder, setMemberSortOrder] =
    useState<MemberSortOrder>("desc");
  const [memberPage, setMemberPage] = useState(1);
  const [memberPerPage, setMemberPerPage] = useState("24");
  const debouncedMemberSearch = useDebounce(memberSearch, 350);

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

  const {
    data: classMembersResponse,
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = useGetData<APIListResponse<ClassMemberResponse>>({
    key: [
      "admin",
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
  const members = classMembersResponse?.data ?? [];
  const totalMembers = classMembersResponse?.meta?.total_items ?? members.length;
  const totalMemberPages = Math.max(1, classMembersResponse?.meta?.total_pages ?? 1);
  const currentMemberPage = classMembersResponse?.meta?.current_page ?? memberPage;
  const visiblePageNumbers = Array.from(
    { length: totalMemberPages },
    (_, index) => index + 1,
  ).filter((pageNumber) => {
    if (totalMemberPages <= 7) {
      return true;
    }

    const isNearCurrent = Math.abs(pageNumber - currentMemberPage) <= 1;
    const isEdge = pageNumber <= 2 || pageNumber > totalMemberPages - 2;
    return isNearCurrent || isEdge;
  });

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

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/dashboard/classes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class list
        </Link>
      </div>

      <Card className="overflow-hidden border-border/70">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.10),transparent_50%)]" />
          <div className="relative grid gap-5 px-6 py-6 md:px-8 md:py-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{classData.classCode}</Badge>
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
                {classData.description?.trim() ||
                  "No class description yet. Add context to help admins and teachers quickly understand this class."}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/80 px-4 py-3 backdrop-blur">
              <p className="text-xs text-muted-foreground">Class Teacher</p>
              <p className="mt-1 font-medium">
                {classData.teacher?.fullName || "Unassigned"}
              </p>
              <p className="text-xs text-muted-foreground">
                {classData.teacher?.email || "No email"}
              </p>
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

      <div className="space-y-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Class Members</CardTitle>
            <CardDescription>
              Non-table member cards for quick scanning and daily monitoring.
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
                  placeholder="Search members by name or email"
                  className="pl-9"
                />
              </label>

              <Select
                value={memberSortBy}
                onValueChange={(value) =>
                  {
                    setMemberSortBy(value as MemberSortBy);
                    setMemberPage(1);
                  }
                }
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
                onValueChange={(value) =>
                  {
                    setMemberSortOrder(value as MemberSortOrder);
                    setMemberPage(1);
                  }
                }
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
                Showing {members.length} of {totalMembers} members
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

            {isLoadingMembers ? (
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
                  No members found.
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
                        member.role === "TEACHER"
                          ? "border-primary/45"
                          : "border-border/70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
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
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        <p className="inline-flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Joined {formatDateLabel(member.createdAt)}
                        </p>
                        <p className="inline-flex items-center gap-2">
                          <UserRound className="h-3.5 w-3.5" />
                          Account role: {member.user.role}
                        </p>
                        {member.user.isSuspended && (
                          <p className="inline-flex items-center gap-2 text-destructive">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Suspended account
                          </p>
                        )}
                      </div>
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
                          <span className="px-1 text-sm text-muted-foreground">...</span>
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

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Class Snapshot</CardTitle>
            <CardDescription>
              Quick metadata for admin/teacher checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Institution</p>
              <p className="inline-flex items-center gap-2 font-medium">
                <School className="h-4 w-4" />
                {classData.institutionName || "Not set"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Academic Year</p>
              <p className="inline-flex items-center gap-2 font-medium">
                <CalendarDays className="h-4 w-4" />
                {classData.academicYear || "Not set"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Class Level</p>
              <p className="inline-flex items-center gap-2 font-medium">
                <GraduationCap className="h-4 w-4" />
                {classData.classLevel
                  ? `Grade ${classData.classLevel}`
                  : "Not set"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Teacher Contact</p>
              <p className="inline-flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4" />
                {classData.teacher?.email || "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
