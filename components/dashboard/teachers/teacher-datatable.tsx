"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDeleteData } from "@/hooks/use-delete-data";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { DataTable } from "@/components/globals/datatable/data-table";
import { type FilterOption } from "@/components/globals/datatable/data-table-toolbar";
import { getTeacherColumns } from "@/components/dashboard/teachers/teacher-columns";
import type { UsersListResponse } from "@/components/dashboard/teachers/teacher-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authTokenStorage } from "@/lib/axios-instance";

const statusFilterOptions: FilterOption[] = [
  { label: "Active", value: "false" },
  { label: "Suspended", value: "true" },
];

export function TeacherDataTable() {
  const {
    data: listResponse,
    isLoading,
    isFetching,
    error,
  } = useGetData<UsersListResponse>({
    key: ["admin", "teachers"],
    endpoint: "/admin/users",
    extractData: false,
    params: {
      page: 1,
      per_page: 100,
      role: "TEACHER",
      sort_by: "createdAt",
      sort_order: "desc",
    },
    errorMessage: "Failed to load teacher data.",
  });

  const suspendTeacherMutation = usePatchData<
    unknown,
    { id: string; suspended: boolean }
  >({
    key: ["admin", "teachers", "suspend"],
    endpoint: (variables) => `/admin/users/${variables.id}/suspend`,
    successMessage: "Teacher status updated successfully.",
    errorMessage: "Failed to update teacher status.",
    invalidateKeys: [["admin", "teachers"]],
  });

  const deleteTeacherMutation = useDeleteData<unknown, { id: string }>({
    key: ["admin", "teachers", "delete"],
    endpoint: (variables) => `/admin/users/${variables.id}`,
    successMessage: "Teacher deleted successfully.",
    errorMessage: "Failed to delete teacher.",
    invalidateKeys: [["admin", "teachers"]],
  });

  const rows = listResponse?.data ?? [];

  const columns = useMemo(
    () =>
      getTeacherColumns({
        onDelete: (teacher) => deleteTeacherMutation.mutate({ id: teacher.id }),
        onToggleSuspend: (teacher) =>
          suspendTeacherMutation.mutate({
            id: teacher.id,
            suspended: !teacher.isSuspended,
          }),
      }),
    [deleteTeacherMutation, suspendTeacherMutation],
  );

  const errorStatus = (error as AxiosError | null)?.response?.status;
  const isForbidden = errorStatus === 403;
  const canCreate = authTokenStorage.getUserRole() === "ADMIN";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          {isFetching ? (
            <Spinner className="size-3.5 text-muted-foreground" />
          ) : null}
          {canCreate ? (
            <Button asChild>
              <Link href="/dashboard/teachers/create">
                <Plus className="h-4 w-4" />
                Add Teacher
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {isForbidden ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            You do not have permission to access teacher management.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner />
            Loading teacher data...
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          searchColumnId="fullName"
          searchPlaceholder="Enter full name"
          filterColumnId="isSuspended"
          filterOptions={statusFilterOptions}
        />
      )}
    </section>
  );
}

