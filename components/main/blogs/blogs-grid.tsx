"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Search, X } from "lucide-react";
import { useGetData } from "@/hooks/use-get-data";
import { APIListResponse } from "@/types/api-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublicBlogPost,
  PublicBlogSortBy,
  PublicBlogSortOrder,
} from "./blog-public-types";
import { formatDateLabel } from "@/lib/utils";

const PAGE_SIZE = 6;

type SortOption = "newest" | "oldest" | "title-asc";

function mapSortToApi(sortBy: SortOption): {
  sortBy: PublicBlogSortBy;
  sortOrder: PublicBlogSortOrder;
} {
  if (sortBy === "oldest") {
    return { sortBy: "publishedAt", sortOrder: "asc" };
  }

  if (sortBy === "title-asc") {
    return { sortBy: "title", sortOrder: "asc" };
  }

  return { sortBy: "publishedAt", sortOrder: "desc" };
}

export function BlogsGrid() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const searchKeyword = search.trim();
  const sortConfig = mapSortToApi(sortBy);

  const {
    data: listResponse,
    isLoading,
    isError,
  } = useGetData<APIListResponse<PublicBlogPost>>({
    key: [
      "public",
      "blogs",
      {
        page,
        perPage: PAGE_SIZE,
        search: searchKeyword,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      },
    ],
    endpoint: "/blogs",
    extractData: false,
    params: {
      page,
      per_page: PAGE_SIZE,
      search: searchKeyword || undefined,
      sort_by: sortConfig.sortBy,
      sort_order: sortConfig.sortOrder,
    },
    errorMessage: "Failed to load blog posts.",
  });

  const blogs = listResponse?.data ?? [];
  const totalCount = listResponse?.meta?.total_items ?? 0;
  const totalPages = Math.max(1, listResponse?.meta?.total_pages ?? 1);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const onResetFilters = () => {
    setSearch("");
    setSortBy("newest");
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onSortChange = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
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
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm md:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_250px_auto]">
            <label className="relative block md:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search articles..."
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary/45"
              />
            </label>

            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-border/50 bg-background/70">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border/60 px-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {blogs.length} of {totalCount} article{totalCount === 1 ? "" : "s"}
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">Loading articles...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-sm text-muted-foreground">Failed to load articles.</p>
          </motion.div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-xl font-semibold text-foreground">No matching articles found.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search keyword.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {blogs.map((blog, index) => (
                <motion.article
                  custom={index}
                  variants={cardVariants}
                  key={blog.id}
                  className="group flex h-full flex-col rounded-3xl border border-border/50 bg-card/65 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Published Article
                  </p>

                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {blog.title?.trim() || "Untitled blog"}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {blog.excerpt?.trim() || "No excerpt available."}
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateLabel(blog.publishedAt ?? blog.createdAt, {
                        emptyLabel: "Not published",
                      })}
                    </span>
                    <span>By {blog.author?.fullName?.trim() || "Unknown author"}</span>
                  </div>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary"
                  >
                    Read article
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </motion.article>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08, ease: smoothEase }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                className="h-10 rounded-xl border border-border/60 px-4 text-sm text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 min-w-10 rounded-xl border px-3 text-sm transition-colors ${
                    page === pageNumber
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                className="h-10 rounded-xl border border-border/60 px-4 text-sm text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
