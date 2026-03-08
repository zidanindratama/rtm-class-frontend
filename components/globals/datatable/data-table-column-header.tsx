"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          "flex items-center text-[13px] font-semibold tracking-tight text-foreground/90",
          className
        )}
      >
        {title}
      </div>
    );
  }

  const sorted = column.getIsSorted();
  const icon =
    sorted === "desc" ? (
      <ArrowDown className="h-3.5 w-3.5" />
    ) : sorted === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronsUpDown className="h-3.5 w-3.5 opacity-65" />
    );

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-2 h-8 gap-1.5 px-2 text-[13px] font-semibold tracking-tight text-foreground/90 hover:bg-transparent hover:text-foreground",
        sorted && "text-foreground",
        className
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      <span>{title}</span>
      <span className="text-muted-foreground">{icon}</span>
    </Button>
  );
}
