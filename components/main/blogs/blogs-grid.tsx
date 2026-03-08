"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock3, Search, X } from "lucide-react";
import { mockBlogs } from "@/lib/mock-blogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 6;

type SortOption = "newest" | "oldest" | "title-asc" | "read-time-asc";

function extractReadTimeMinutes(readTime: string) {
  const minutes = Number.parseInt(readTime, 10);
  return Number.isNaN(minutes) ? 0 : minutes;
}

export function BlogsGrid() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(mockBlogs.map((blog) => blog.category).sort((a, b) => a.localeCompare(b))),
    ],
    []
  );

  const tags = useMemo(
    () => [
      "all",
      ...new Set(mockBlogs.flatMap((blog) => blog.tags).sort((a, b) => a.localeCompare(b))),
    ],
    []
  );

  const filteredAndSortedBlogs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = mockBlogs.filter((blog) => {
      const matchesKeyword =
        keyword.length === 0 ||
        blog.title.toLowerCase().includes(keyword) ||
        blog.excerpt.toLowerCase().includes(keyword) ||
        blog.author.toLowerCase().includes(keyword);

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      const matchesTag = selectedTag === "all" || blog.tags.includes(selectedTag);

      return matchesKeyword && matchesCategory && matchesTag;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }

      if (sortBy === "oldest") {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }

      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      return extractReadTimeMinutes(a.readTime) - extractReadTimeMinutes(b.readTime);
    });

    return sorted;
  }, [search, selectedCategory, selectedTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedBlogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedBlogs = filteredAndSortedBlogs.slice(startIndex, startIndex + PAGE_SIZE);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const onResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("newest");
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const onTagChange = (value: string) => {
    setSelectedTag(value);
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search articles..."
                className="h-11 w-full rounded-2xl border border-border/50 bg-background/70 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary/45"
              />
            </label>

            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-border/50 bg-background/70">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={onTagChange}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-border/50 bg-background/70">
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag === "all" ? "All topics" : tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                <SelectTrigger className="h-11 w-full flex-1 rounded-2xl border-border/50 bg-background/70">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="read-time-asc">Read Time (Short)</SelectItem>
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
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedBlogs.length} article{filteredAndSortedBlogs.length === 1 ? "" : "s"}
          </p>
        </motion.div>

        {paginatedBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: smoothEase }}
            className="mt-6 rounded-3xl border border-border/45 bg-card/55 p-10 text-center"
          >
            <p className="text-xl font-semibold text-foreground">No matching articles found.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search keyword or filter selection.
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
              {paginatedBlogs.map((blog, index) => (
                <motion.article
                  custom={index}
                  variants={cardVariants}
                  key={blog.id}
                  className="group flex h-full flex-col rounded-3xl border border-border/50 bg-card/65 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {blog.category}
                  </p>

                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                    {blog.title}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {blog.excerpt}
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {blog.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {blog.readTime}
                    </span>
                  </div>

                  <Link
                    href={`/blogs/${blog.id}`}
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
                disabled={safePage === 1}
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
                    safePage === pageNumber
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
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
