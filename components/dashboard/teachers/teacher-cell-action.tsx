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
import type { TeacherUser } from "@/components/dashboard/teachers/teacher-types";

type TeacherCellActionProps = {
  teacher: TeacherUser;
  onDelete: (teacher: TeacherUser) => void;
  onToggleSuspend: (teacher: TeacherUser) => void;
};

export function TeacherCellAction({
  teacher,
  onDelete,
  onToggleSuspend,
}: TeacherCellActionProps) {
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
          <DropdownMenuItem onSelect={() => router.push(`/dashboard/teachers/${teacher.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpenSuspendConfirm(true);
            }}
          >
            {teacher.isSuspended ? "Unsuspend" : "Suspend"}
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
        title={teacher.isSuspended ? "Unsuspend teacher?" : "Suspend teacher?"}
        description={
          teacher.isSuspended
            ? `This will reactivate "${teacher.fullName}" account access.`
            : `This will suspend "${teacher.fullName}" account access.`
        }
        confirmText={teacher.isSuspended ? "Unsuspend" : "Suspend"}
        onConfirm={() => onToggleSuspend(teacher)}
      />

      <ConfirmActionDialog
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
        title="Delete teacher?"
        description={`This action cannot be undone. "${teacher.fullName}" will be removed permanently.`}
        confirmText="Delete"
        onConfirm={() => onDelete(teacher)}
      />
    </>
  );
}

