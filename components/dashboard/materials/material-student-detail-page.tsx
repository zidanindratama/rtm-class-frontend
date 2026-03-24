"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  FileText,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { APISingleResponse } from "@/types/api-response";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
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
import { MATERIAL_TYPE_LABELS } from "./material-constants";
import { MaterialDetailResponse } from "./material-types";
import { formatDateLabel } from "@/lib/utils";

type MaterialStudentDetailPageProps = {
  classId: string;
  materialId: string;
};

function resolveMaterialType(type?: string) {
  const normalizedType = type?.trim().toUpperCase() ?? "OTHER";
  return MATERIAL_TYPE_LABELS[normalizedType] ?? normalizedType;
}

export function MaterialStudentDetailPage({
  classId,
  materialId,
}: MaterialStudentDetailPageProps) {
  const backHref = `/dashboard/my-class/${classId}/materials`;

  const {
    data: classDetailResponse,
    isLoading: isLoadingClass,
    isError: isClassError,
  } = useGetData<APISingleResponse<ClassDetailResponse>>({
    key: ["class-materials", "class", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const {
    data: materialDetailResponse,
    isLoading: isLoadingMaterial,
    isError: isMaterialError,
  } = useGetData<APISingleResponse<MaterialDetailResponse>>({
    key: ["class-materials", "student-detail", materialId],
    endpoint: `/materials/${materialId}`,
    extractData: false,
    errorMessage: "Failed to load material detail.",
  });

  if (isLoadingClass || isLoadingMaterial) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="py-10">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              Loading material...
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isMaterialError || !materialDetailResponse?.data) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Unable to load this material.
          </CardContent>
        </Card>
      </section>
    );
  }

  const classData = classDetailResponse?.data;
  const material = materialDetailResponse.data as MaterialDetailResponse & {
    fileUrl?: string | null;
  };
  const sourceUrl = material.sourceUrl ?? material.fileUrl ?? null;
  const teacherName = material.teacher?.fullName?.trim() || "Class Teacher";
  const materialTypeLabel = resolveMaterialType(material.type);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to materials
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Material Detail</h1>
        <p className="text-sm text-muted-foreground">
          Read and learn from this class material. This page is view-only for students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{materialTypeLabel}</Badge>
              <Badge variant="outline">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDateLabel(material.createdAt, { invalidLabel: "-" })}
              </Badge>
            </div>
            <CardTitle className="text-2xl leading-tight">{material.title}</CardTitle>
            <CardDescription className="text-sm">
              Uploaded by {teacherName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {material.description?.trim() || "No description provided for this material."}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Study Suggestion
              </p>
              <div className="mt-3 grid gap-2 text-sm text-foreground/90 md:grid-cols-2">
                <div className="inline-flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  Focus on key terms and examples first.
                </div>
                <div className="inline-flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  Write short notes while reading.
                </div>
                <div className="inline-flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  Discuss unclear topics in class forum.
                </div>
                <div className="inline-flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  Revisit this material before assignments.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {sourceUrl ? (
                <Button asChild>
                  <Link href={sourceUrl} target="_blank" rel="noreferrer">
                    <BookOpenText className="h-4 w-4" />
                    Open Material
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button disabled>
                  <FileText className="h-4 w-4" />
                  Material File Unavailable
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={backHref}>Back to List</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Class Context</CardTitle>
            <CardDescription>Quick info about this classroom.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isClassError || !classData ? (
              <p className="text-muted-foreground">Class information is unavailable.</p>
            ) : (
              <>
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-medium">{classData.name}</p>
                  <p className="text-xs text-muted-foreground">{classData.classCode}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-xs text-muted-foreground">Teacher</p>
                  <p className="inline-flex items-center gap-2 font-medium">
                    <UserRound className="h-4 w-4" />
                    {classData.teacher?.fullName ?? teacherName}
                  </p>
                </div>
              </>
            )}
            <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-muted-foreground">
              Need clarification? Ask your teacher or open the class forum for discussion.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

