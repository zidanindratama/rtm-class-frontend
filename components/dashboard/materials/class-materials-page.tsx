"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  PlusIcon,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetData } from "@/hooks/use-get-data";
import { APIListResponse, APISingleResponse } from "@/types/api-response";
import { ClassDetailResponse } from "@/components/dashboard/classes/class-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PaginationWithLinks } from "@/components/ui/pagination-with-link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MATERIAL_AI_STATUS_LABELS,
  MATERIAL_SORT_BY_LABELS,
  MATERIAL_SORT_ORDER_LABELS,
  MATERIAL_TYPE_LABELS,
} from "./material-constants";
import {
  MaterialAiStatusKey,
  MaterialListItem,
  MaterialSortByOption,
  MaterialSortOrderOption,
} from "./material-types";

type ClassMaterialsPageProps = {
  classId: string;
  backHref: string;
  backLabel: string;
};

const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 12, 24];
const sortByOptions: MaterialSortByOption[] = ["all", "createdAt", "title"];
const sortOrderOptions: MaterialSortOrderOption[] = ["all", "asc", "desc"];
const aiStatusItems = [
  { key: "mcq", label: "MCQ" },
  { key: "essay", label: "Essay" },
  { key: "summary", label: "Summary" },
] as const;

function formatDateLabel(iso: string | null | undefined) {
  if (!iso) return "Unknown date";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function normalizeMaterialType(type: string | null | undefined) {
  const normalized = type?.trim().toUpperCase();
  return normalized && normalized.length > 0 ? normalized : "OTHER";
}

function normalizeAiStatus(
  status: string | null | undefined,
): MaterialAiStatusKey | "UNKNOWN" {
  if (
    status === "PENDING" ||
    status === "PROCESSING" ||
    status === "DONE" ||
    status === "FAILED"
  ) {
    return status;
  }

  return "UNKNOWN";
}

function getMaterialTypeVariant(
  type: string,
): "default" | "secondary" | "outline" {
  if (type === "PDF") return "default";
  if (type === "VIDEO") return "secondary";
  return "outline";
}

function getAiStatusVariant(
  status: MaterialAiStatusKey | "UNKNOWN",
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "DONE") return "default";
  if (status === "FAILED") return "destructive";
  if (status === "PROCESSING") return "secondary";
  return "outline";
}

export function ClassMaterialsPage({
  classId,
  backHref,
  backLabel,
}: ClassMaterialsPageProps) {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<MaterialSortByOption>("all");
  const [sortOrder, setSortOrder] = useState<MaterialSortOrderOption>("all");

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

  const { data: classDetailResponse } = useGetData<
    APISingleResponse<ClassDetailResponse>
  >({
    key: ["class-materials", "class", classId],
    endpoint: `/classes/${classId}`,
    extractData: false,
    errorMessage: "Failed to load class detail.",
  });

  const {
    data: listResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<MaterialListItem>>({
    key: [
      "class-materials",
      "list",
      classId,
      {
        page,
        perPage,
        search: searchKeyword,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      },
    ],
    endpoint: "/materials",
    extractData: false,
    params: {
      classId,
      page,
      per_page: perPage,
      search: searchKeyword || undefined,
      sort_by: sortByParam,
      sort_order: sortOrderParam,
    },
    errorMessage: "Failed to load materials.",
  });

  const classData = classDetailResponse?.data;
  const materials = listResponse?.data ?? [];
  const totalCount = listResponse?.meta?.total_items ?? materials.length;
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

  const onSortByChange = (value: MaterialSortByOption) => {
    setSortBy(value);
    clearPageQuery();
  };

  const onSortOrderChange = (value: MaterialSortOrderOption) => {
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
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          Class Materials
        </h1>
        <p className="text-sm text-muted-foreground">
          {classData
            ? `Learning materials for ${classData.name} (${classData.classCode}).`
            : "Browse learning resources attached to this class."}
        </p>
      </div>

      <div className="mx-auto">
        <div className="flex my-3">
          <Button className="ml-auto" asChild>
            <Link
              href={`/dashboard/my-class/${classId}/materials/create`}
              className="inline-flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Material
            </Link>
          </Button>
        </div>
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
                placeholder="Search material title"
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary/45"
              />
            </Label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  onSortByChange(value as MaterialSortByOption)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {MATERIAL_SORT_BY_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value) =>
                  onSortOrderChange(value as MaterialSortOrderOption)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  {sortOrderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {MATERIAL_SORT_ORDER_LABELS[option]}
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
            Showing {materials.length} of {totalCount} material
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
            <p className="text-sm text-muted-foreground">
              Loading materials...
            </p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Failed to load materials.
            </p>
          </motion.div>
        ) : materials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-xl font-semibold text-foreground">
              No materials found.
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
              {materials.map((material, index) => {
                const normalizedType = normalizeMaterialType(material.type);
                const sourceUrl = material.sourceUrl?.trim();

                return (
                  <motion.article
                    custom={index}
                    variants={cardVariants}
                    key={material.id}
                    className="group flex h-full flex-col rounded-3xl border border-border/50 bg-card/65 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={getMaterialTypeVariant(normalizedType)}>
                        {MATERIAL_TYPE_LABELS[normalizedType] ?? normalizedType}
                      </Badge>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateLabel(material.createdAt)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                      {material.title?.trim() || "Untitled material"}
                    </h2>

                    <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {material.description?.trim() ||
                        "No description available."}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <UserRound className="h-3.5 w-3.5" />
                      {material.teacher?.fullName?.trim() || "Unknown teacher"}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {aiStatusItems.map((statusItem) => {
                        const normalizedStatus = normalizeAiStatus(
                          material.aiStatus?.[statusItem.key],
                        );

                        return (
                          <Badge
                            key={`${material.id}-${statusItem.key}`}
                            variant={getAiStatusVariant(normalizedStatus)}
                            className="rounded-md px-2 py-0.5 text-[11px]"
                          >
                            <Sparkles className="h-3 w-3" />
                            {statusItem.label}:{" "}
                            {MATERIAL_AI_STATUS_LABELS[normalizedStatus]}
                          </Badge>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3">
                      <Link
                        href={`/dashboard/my-class/${classId}/materials/${material.id}/edit`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-3"
                      >
                        Material Detail
                      </Link>
                      {sourceUrl ? (
                        <Link
                          href={sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary hover:underline underline-offset-3"
                        >
                          Open Material
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No source file
                        </span>
                      )}
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
    </section>
  );
}
