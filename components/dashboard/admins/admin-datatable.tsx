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
import { getAdminColumns } from "@/components/dashboard/admins/admin-columns";
import type { UsersListResponse } from "@/components/dashboard/admins/admin-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authTokenStorage } from "@/lib/axios-instance";

const statusFilterOptions: FilterOption[] = [
  { label: "Active", value: "false" },
  { label: "Suspended", value: "true" },
];

export function AdminDataTable() {
  const {
    data: listResponse,
    isLoading,
    isFetching,
    error,
  } = useGetData<UsersListResponse>({
    key: ["admin", "admins"],
    endpoint: "/admin/users",
    extractData: false,
    params: {
      page: 1,
      per_page: 100,
      role: "ADMIN",
      sort_by: "createdAt",
      sort_order: "desc",
    },
    errorMessage: "Failed to load admin data.",
  });

  const suspendAdminMutation = usePatchData<
    unknown,
    { id: string; suspended: boolean }
  >({
    key: ["admin", "admins", "suspend"],
    endpoint: (variables) => `/admin/users/${variables.id}/suspend`,
    successMessage: "Admin status updated successfully.",
    errorMessage: "Failed to update admin status.",
    invalidateKeys: [["admin", "admins"]],
  });

  const deleteAdminMutation = useDeleteData<unknown, { id: string }>({
    key: ["admin", "admins", "delete"],
    endpoint: (variables) => `/admin/users/${variables.id}`,
    successMessage: "Admin deleted successfully.",
    errorMessage: "Failed to delete admin.",
    invalidateKeys: [["admin", "admins"]],
  });

  const rows = listResponse?.data ?? [];

  const columns = useMemo(
    () =>
      getAdminColumns({
        onDelete: (admin) => deleteAdminMutation.mutate({ id: admin.id }),
        onToggleSuspend: (admin) =>
          suspendAdminMutation.mutate({
            id: admin.id,
            suspended: !admin.isSuspended,
          }),
      }),
    [deleteAdminMutation, suspendAdminMutation],
  );

  const errorStatus = (error as AxiosError | null)?.response?.status;
  const isForbidden = errorStatus === 403;
  const canCreate = authTokenStorage.getUserRole() === "ADMIN";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          {isFetching ? <Spinner className="size-3.5 text-muted-foreground" /> : null}
          {canCreate ? (
            <Button asChild>
              <Link href="/dashboard/admins/create">
                <Plus className="h-4 w-4" />
                Add Admin
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {isForbidden ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            You do not have permission to access admin management.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner />
            Loading admin data...
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

