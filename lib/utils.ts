import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateLabelOptions = {
  emptyLabel?: string
  invalidLabel?: string
  locale?: string
}

type DateTimeLabelOptions = DateLabelOptions & {
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"]
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"]
}

export function formatDateLabel(
  iso?: string | null,
  options: DateLabelOptions = {},
): string {
  const {
    emptyLabel = "-",
    invalidLabel = "Invalid date",
    locale = "en-US",
  } = options

  if (!iso) return emptyLabel

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return invalidLabel

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date)
}

export function formatDateTimeLabel(
  iso?: string | null,
  options: DateTimeLabelOptions = {},
): string {
  const {
    emptyLabel = "-",
    invalidLabel = "Invalid date",
    locale = "en-US",
    dateStyle = "medium",
    timeStyle = "short",
  } = options

  if (!iso) return emptyLabel

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return invalidLabel

  return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(date)
}

export function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim()
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function textToHtmlParagraphs(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("")
}

export function appendSummaryToContentHtml(
  contentHtml: string,
  summaryText: string,
): string {
  const trimmedSummary = summaryText.trim()
  if (!trimmedSummary) {
    return contentHtml
  }

  const summarySection = `<h3>Summary</h3>${textToHtmlParagraphs(trimmedSummary)}`
  const trimmedContent = contentHtml.trim()
  return trimmedContent ? `${trimmedContent}${summarySection}` : summarySection
}

export function getInitials(name: string, maxParts = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxParts)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function alphaToIndex(value: string): number {
  const normalized = value.trim().toUpperCase()
  if (normalized.length !== 1) {
    return -1
  }

  const index = normalized.charCodeAt(0) - 65
  return index >= 0 && index <= 25 ? index : -1
}
