"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { ConfirmActionDialog } from "@/components/globals/datatable/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/components/dashboard/admins/admin-types";

type AdminCellActionProps = {
  admin: AdminUser;
  onDelete: (admin: AdminUser) => void;
  onToggleSuspend: (admin: AdminUser) => void;
};

export function AdminCellAction({
  admin,
  onDelete,
  onToggleSuspend,
}: AdminCellActionProps) {
  const router = useRouter();
  const [openSuspendConfirm, setOpenSuspendConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => router.push(`/dashboard/admins/${admin.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpenSuspendConfirm(true);
            }}
          >
            {admin.isSuspended ? "Unsuspend" : "Suspend"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setOpenDeleteConfirm(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={openSuspendConfirm}
        onOpenChange={setOpenSuspendConfirm}
        title={admin.isSuspended ? "Unsuspend admin?" : "Suspend admin?"}
        description={
          admin.isSuspended
            ? `This will reactivate "${admin.fullName}" account access.`
            : `This will suspend "${admin.fullName}" account access.`
        }
        confirmText={admin.isSuspended ? "Unsuspend" : "Suspend"}
        onConfirm={() => onToggleSuspend(admin)}
      />

      <ConfirmActionDialog
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
        title="Delete admin?"
        description={`This action cannot be undone. "${admin.fullName}" will be removed permanently.`}
        confirmText="Delete"
        onConfirm={() => onDelete(admin)}
      />
    </>
  );
}

