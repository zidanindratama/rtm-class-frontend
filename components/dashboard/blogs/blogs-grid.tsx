"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  EllipsisIcon,
  Pencil,
  PlusIcon,
  MessageCircle,
  Search,
  Trash,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGetData } from "@/hooks/use-get-data";
import { APIListResponse } from "@/types/api-response";
import {
  BlogDetailResponse,
  PublishedFilterOption,
  SortByOption,
  SortOrderOption,
} from "./blog-types";
import { useDeleteData } from "@/hooks/use-delete-data";
import { DeleteDialog } from "@/components/globals/dialog/delete-dialog";
import {
  PUBLISHED_FILTER_LABELS,
  SORT_BY_LABELS,
  SORT_ORDER_LABELS,
} from "./blog-constants";

const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 12, 24];

function getPrimaryBlogDate(
  isoPublishedAt: string | null,
  isoCreatedAt: string,
) {
  return isoPublishedAt ?? isoCreatedAt;
}

function formatDateLabel(iso: string | null) {
  if (!iso) return "Not published";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

const statusOptions: PublishedFilterOption[] = ["all", "true", "false"];
const sortByOptions: SortByOption[] = [
  "all",
  "createdAt",
  "publishedAt",
  "title",
];
const sortOrderOptions: SortOrderOption[] = ["all", "asc", "desc"];

export function AdminBlogsGrid() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedPublished, setSelectedPublished] =
    useState<PublishedFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortByOption>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("all");
  const [blogPendingDelete, setBlogPendingDelete] =
    useState<BlogDetailResponse | null>(null);

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
  const isPublishedParam =
    selectedPublished === "all" ? undefined : selectedPublished === "true";
  const sortByParam = sortBy === "all" ? undefined : sortBy;
  const sortOrderParam =
    sortByParam && sortOrder !== "all" ? sortOrder : undefined;

  const {
    data: listResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<BlogDetailResponse>>({
    key: [
      "admin",
      "blogs",
      {
        page,
        perPage,
        search: searchKeyword,
        isPublished: isPublishedParam,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      },
    ],
    endpoint: "/admin/blogs",
    extractData: false,
    params: {
      page,
      per_page: perPage,
      search: searchKeyword || undefined,
      isPublished: isPublishedParam,
      sort_by: sortByParam,
      sort_order: sortOrderParam,
    },
    errorMessage: "Failed to load blog data.",
  });

  const deleteBlogMutation = useDeleteData<unknown, { id: string }>({
    key: ["admin", "blogs", "delete"],
    endpoint: (variables) => `/admin/blogs/${variables.id}`,
    successMessage: "Blog deleted successfully.",
    errorMessage: "Failed to delete blog.",
    invalidateKeys: [["admin", "blogs"]],
  });

  const blogs = listResponse?.data ?? [];
  const totalCount = listResponse?.meta?.total_items ?? blogs.length;
  const currentPage = listResponse?.meta?.current_page ?? page;

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedPublished !== "all" ||
    sortBy !== "all" ||
    sortOrder !== "all";

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
    setSelectedPublished("all");
    setSortBy("all");
    setSortOrder("all");
    clearPageQuery();
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    clearPageQuery();
  };

  const onPublishedChange = (value: PublishedFilterOption) => {
    setSelectedPublished(value);
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
    <section className="">
      <div className="mx-auto ">
        <div className="flex my-3">
          <Button className="ml-auto" asChild>
            <Link
              href="/dashboard/blogs/create"
              className="inline-flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Blog
            </Link>
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="rounded-3xl  border border-border/50 bg-card/60 p-5 backdrop-blur-sm md:p-6"
        >
          <div className="flex flex-col gap-3">
            <Label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search articles..."
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary/45"
              />
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={selectedPublished}
                onValueChange={(value) =>
                  onPublishedChange(value as PublishedFilterOption)
                }
              >
                <SelectTrigger className="h-11 w-full rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {PUBLISHED_FILTER_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) => onSortByChange(value as SortByOption)}
              >
                <SelectTrigger className="h-11 w-full rounded-2xl border-border/50 bg-background/70">
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
                <SelectTrigger className="h-11 w-full flex-1 rounded-2xl border-border/50 bg-background/70">
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
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={onResetFilters}
                >
                  <X className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {blogs.length} of {totalCount} article
            {totalCount === 1 ? "" : "s"}
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">Loading articles...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Failed to load articles.
            </p>
          </motion.div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-xl font-semibold text-foreground">
              No matching articles found.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search keyword or filter selection.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={false}
              animate="show"
              className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {blogs.map((blog, index) => {
                return (
                  <motion.article
                    custom={index}
                    variants={cardVariants}
                    key={
                      blog.id ||
                      blog.slug ||
                      `${blog.createdAt ?? "blog"}-${index}`
                    }
                    className="group flex h-full flex-col rounded-3xl border border-border/50 bg-card/65 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <Badge
                      variant={blog.isPublished ? "default" : "outline"}
                      className="self-start"
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </Badge>

                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                      {blog.title?.trim() || "Untitled blog"}
                    </h2>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {blog.excerpt?.trim() || "No excerpt available."}
                    </p>

                    <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateLabel(
                          getPrimaryBlogDate(blog.publishedAt, blog.createdAt),
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5" />
                        {blog.author?.fullName?.trim() || "Unknown author"}
                      </span>
                    </div>

                    <div className="flex mt-6  justify-between items-center">
                      <Link
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary hover:underline underline-offset-3"
                        href={`/blogs/${blog.slug || blog.id}`}
                      >
                        Read article
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <EllipsisIcon className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                              <Pencil className="mr-1 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/blogs/${blog.slug}#comments`}>
                              <MessageCircle className="mr-1 h-4 w-4" />
                              <span>Moderate Comments</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setBlogPendingDelete(blog)}
                            disabled={deleteBlogMutation.isPending}
                          >
                            <Trash className="mr-1 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
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
        open={Boolean(blogPendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setBlogPendingDelete(null);
          }
        }}
        title="Delete blog?"
        description={
          blogPendingDelete
            ? `This action cannot be undone. "${blogPendingDelete.title}" will be removed permanently.`
            : ""
        }
        confirmText="Delete"
        onConfirm={() => {
          if (!blogPendingDelete) return;

          const blogId = blogPendingDelete.id;
          setBlogPendingDelete(null);
          deleteBlogMutation.mutate({ id: blogId });
        }}
      />
    </section>
  );
}
