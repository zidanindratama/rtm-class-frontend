import { UtilPageDetail } from "@/components/main/util-pages/util-page-detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockUtilPageById } from "@/lib/mock-util-pages";
import { createPageMetadata } from "@/lib/seo";

type UtilPageDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: UtilPageDetailRouteProps): Promise<Metadata> {
  const { id } = await params;
  const page = getMockUtilPageById(id);

  if (!page) {
    return createPageMetadata({
      title: "Utility Page Not Found",
      description: "The requested utility page could not be found.",
      path: `/util-pages/${id}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${page.name} (${page.statusCode})`,
    description: page.summary,
    path: `/util-pages/${id}`,
    noIndex: true,
  });
}

export default async function UtilPageDetailRoute({
  params,
}: UtilPageDetailRouteProps) {
  const { id } = await params;
  const page = getMockUtilPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <UtilPageDetail id={id} />
    </div>
  );
}
