"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  EllipsisIcon,
  GraduationCap,
  PlusIcon,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetData } from "@/hooks/use-get-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { APIListResponse } from "@/types/api-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import { authTokenStorage } from "@/lib/axios-instance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClassDetailResponse,
  SortByOption,
  SortOrderOption,
} from "@/components/dashboard/classes/class-types";
import {
  SORT_BY_LABELS,
  SORT_ORDER_LABELS,
} from "@/components/dashboard/classes/class-constants";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const sortByOptions: SortByOption[] = ["all", "createdAt", "name", "classCode"];
const sortOrderOptions: SortOrderOption[] = ["all", "asc", "desc"];

function formatDateLabel(iso: string | null) {
  if (!iso) return "Unknown date";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function MyClassGrid() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortByOption>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("all");
  const [classPendingDelete, setClassPendingDelete] =
    useState<ClassDetailResponse | null>(null);
  const currentRole = authTokenStorage.getUserRole();
  const canManageClass = currentRole === "TEACHER" || currentRole === "ADMIN";

  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);

  const rawPerPage = Number.parseInt(
    searchParams.get("per_page") ?? String(DEFAULT_PAGE_SIZE),
    10,
  );
  const perPage = PAGE_SIZE_OPTIONS.includes(rawPerPage)
    ? rawPerPage
    : DEFAULT_PAGE_SIZE;

  const searchKeyword = search.trim();
  const sortByParam = sortBy === "all" ? undefined : sortBy;
  const sortOrderParam =
    sortByParam && sortOrder !== "all" ? sortOrder : undefined;

  const {
    data: listResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<ClassDetailResponse>>({
    key: [
      "my-class",
      {
        page,
        perPage,
        search: searchKeyword,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      },
    ],
    endpoint: "/classes",
    extractData: false,
    params: {
      page,
      per_page: perPage,
      search: searchKeyword || undefined,
      sort_by: sortByParam,
      sort_order: sortOrderParam,
    },
    errorMessage: "Failed to load class data.",
  });

  const deleteClassMutation = useDeleteData<unknown, { id: string }>({
    key: ["my-class", "delete"],
    endpoint: (variables) => `/classes/${variables.id}`,
    successMessage: "Class deleted successfully.",
    errorMessage: "Failed to delete class.",
    invalidateKeys: [["my-class"], ["admin", "classes"]],
  });

  const classes = listResponse?.data ?? [];
  const totalCount = listResponse?.meta?.total_items ?? classes.length;
  const currentPage = listResponse?.meta?.current_page ?? page;

  const hasActiveFilters =
    search.trim().length > 0 || sortBy !== "all" || sortOrder !== "all";

  const clearPageQuery = () => {
    if (!searchParams.has("page")) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const onResetFilters = () => {
    setSearch("");
    setSortBy("all");
    setSortOrder("all");
    clearPageQuery();
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    clearPageQuery();
  };

  const onSortByChange = (value: SortByOption) => {
    setSortBy(value);
    clearPageQuery();
  };

  const onSortOrderChange = (value: SortOrderOption) => {
    setSortOrder(value);
    clearPageQuery();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: 0.03 * index,
        ease: smoothEase,
      },
    }),
  };

  return (
    <section>
      <div className="mx-auto">
        {canManageClass && (
          <div className="flex my-3">
            <Button className="ml-auto" asChild>
              <Link
                href="/dashboard/classes/create"
                className="inline-flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add New Class
              </Link>
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm md:p-6"
        >
          <div className="flex flex-col gap-3">
            <Label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search class by name"
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary/45"
              />
            </Label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                value={sortBy}
                onValueChange={(value) => onSortByChange(value as SortByOption)}
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {SORT_BY_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value) =>
                  onSortOrderChange(value as SortOrderOption)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  {sortOrderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {SORT_ORDER_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters ? (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onResetFilters}
                >
                  <X className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {classes.length} of {totalCount} class
            {totalCount === 1 ? "" : "es"}
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">Loading classes...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Failed to load classes.
            </p>
          </motion.div>
        ) : classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-xl font-semibold text-foreground">
              No classes found.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search keyword or filter options.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={false}
              animate="show"
              className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {classes.map((cls, index) => {
                const memberCount = cls._count?.members ?? cls.memberCount ?? 0;

                return (
                  <motion.article
                    custom={index}
                    variants={cardVariants}
                    key={cls.id || `${cls.createdAt ?? "class"}-${index}`}
                    className="group flex h-full flex-col rounded-3xl border border-border/50 bg-card/65 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="self-start">
                        {cls.classCode}
                      </Badge>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {cls.academicYear || "No Year"}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                      {cls.name?.trim() || "Untitled Class"}
                    </h2>

                    <p className="mt-3 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {cls.description?.trim() ||
                        cls.institutionName ||
                        "No description available."}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {cls.teacher?.fullName?.trim() || "Unassigned"}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {memberCount} Member{memberCount === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Level {cls.classLevel || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateLabel(cls.createdAt)}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <Link
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary hover:underline underline-offset-3"
                        href={`/dashboard/my-class/${cls.id}`}
                      >
                        View Class
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <EllipsisIcon className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/my-class/${cls.id}/forums`}>
                              Open Forum
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/my-class/${cls.id}/assignments`}
                            >
                              Assignments
                            </Link>
                          </DropdownMenuItem>
                          {canManageClass ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/classes/${cls.id}/edit`}
                                >
                                  Edit Class
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setClassPendingDelete(cls)}
                                disabled={deleteClassMutation.isPending}
                              >
                                Delete Class
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: smoothEase }}
              className="mt-8"
            >
              <PaginationWithLinks
                page={currentPage}
                pageSize={perPage}
                totalCount={totalCount}
                navigationMode="router"
                pageSizeSelectOptions={{
                  pageSizeSearchParam: "per_page",
                  pageSizeOptions: PAGE_SIZE_OPTIONS,
                }}
              />
            </motion.div>
          </>
        )}
      </div>

      <DeleteDialog
        open={Boolean(classPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setClassPendingDelete(null);
        }}
        title="Delete class?"
        description={
          classPendingDelete
            ? `This action cannot be undone. "${classPendingDelete.name}" will be removed permanently.`
            : ""
        }
        confirmText="Delete"
        onConfirm={() => {
          if (!classPendingDelete) return;
          const classId = classPendingDelete.id;
          setClassPendingDelete(null);
          deleteClassMutation.mutate({ id: classId });
        }}
      />
    </section>
  );
}
