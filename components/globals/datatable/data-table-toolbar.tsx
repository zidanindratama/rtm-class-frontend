"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  label: string;
  value: string;
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchColumnId?: string;
  searchPlaceholder?: string;
  filterColumnId?: string;
  filterOptions?: FilterOption[];
};

export function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = "Search...",
  filterColumnId,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchColumnId
    ? table.getColumn(searchColumnId)
    : undefined;
  const filterColumn = filterColumnId
    ? table.getColumn(filterColumnId)
    : undefined;

  const hasFilters = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {searchColumn ? (
          <Input
            placeholder={searchPlaceholder}
            value={(searchColumn.getFilterValue() as string) ?? ""}
            onChange={(event) => searchColumn.setFilterValue(event.target.value)}
            className="w-full sm:max-w-xs"
          />
        ) : null}

        {filterColumn && filterOptions?.length ? (
          <Select
            value={(filterColumn.getFilterValue() as string) ?? "ALL"}
            onValueChange={(value) =>
              filterColumn.setFilterValue(value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
          Reset
          <X className="ml-1 h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

export type { FilterOption };
