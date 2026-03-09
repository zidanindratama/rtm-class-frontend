import { BlogFormPage } from "@/components/dashboard/blogs/blogs-form-page";

export default function DashboardFormBlogPage() {
  return (
    <>
      {/* <section className="space-y-6">
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Create Blog</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below to create a new blog post.
          </p>
        </div>
      </section> */}
      <BlogFormPage mode="create" />
    </>
  );
}
