import type { Metadata } from "next";

export const SITE_NAME = "RTM Class";
export const SITE_URL =
  process.env.NEXT_PUBLIC_CLIENT_DOMAIN || "https://app.rtm-corndog.my.id";
export const DEFAULT_OG_IMAGE = "/og-image-v2.jpeg";

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraphType?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
  openGraphType = "website",
}: CreatePageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      url: canonical,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            "max-image-preview": "none",
            "max-video-preview": -1,
            "max-snippet": -1,
          },
        }
      : undefined,
  };
}
