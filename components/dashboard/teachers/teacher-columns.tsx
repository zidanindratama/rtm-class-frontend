"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/globals/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { TeacherCellAction } from "@/components/dashboard/teachers/teacher-cell-action";
import type { TeacherUser } from "@/components/dashboard/teachers/teacher-types";

type GetTeacherColumnsOptions = {
  onDelete: (teacher: TeacherUser) => void;
  onToggleSuspend: (teacher: TeacherUser) => void;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

export function getTeacherColumns({
  onDelete,
  onToggleSuspend,
}: GetTeacherColumnsOptions): ColumnDef<TeacherUser>[] {
  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[220px] truncate font-medium">{row.original.fullName}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[260px] truncate text-muted-foreground">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "isSuspended",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) =>
        row.original.isSuspended ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        ),
      filterFn: (row, columnId, value) => String(row.getValue(columnId)) === value,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <TeacherCellAction
          teacher={row.original}
          onDelete={onDelete}
          onToggleSuspend={onToggleSuspend}
        />
      ),
    },
  ];
}

