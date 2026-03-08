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
import type { StudentUser } from "@/components/dashboard/students/student-types";

type StudentCellActionProps = {
  student: StudentUser;
  onDelete: (student: StudentUser) => void;
  onToggleSuspend: (student: StudentUser) => void;
};

export function StudentCellAction({
  student,
  onDelete,
  onToggleSuspend,
}: StudentCellActionProps) {
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
          <DropdownMenuItem onSelect={() => router.push(`/dashboard/students/${student.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpenSuspendConfirm(true);
            }}
          >
            {student.isSuspended ? "Unsuspend" : "Suspend"}
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
        title={student.isSuspended ? "Unsuspend student?" : "Suspend student?"}
        description={
          student.isSuspended
            ? `This will reactivate "${student.fullName}" account access.`
            : `This will suspend "${student.fullName}" account access.`
        }
        confirmText={student.isSuspended ? "Unsuspend" : "Suspend"}
        onConfirm={() => onToggleSuspend(student)}
      />

      <ConfirmActionDialog
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
        title="Delete student?"
        description={`This action cannot be undone. "${student.fullName}" will be removed permanently.`}
        confirmText="Delete"
        onConfirm={() => onDelete(student)}
      />
    </>
  );
}
