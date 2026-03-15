"use client";

import { BookOpen, CheckCircle2, ClipboardCheck, Medal, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";
import { useGetData } from "@/hooks/use-get-data";
import type { APISingleResponse } from "@/types/api-response";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardRole } from "@/routes/dashboard-routes";

type DashboardPageContentProps = {
  role?: DashboardRole;
  title?: string;
  description?: string;
};

type StatCard = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

type ScoreTrendPoint = {
  week: string;
  averageScore: number;
};

type TopClassPoint = {
  className: string;
  score: number;
};

type SubmissionStatusPoint = {
  name: string;
  value: number;
  fill: string;
};

type RowPoint = {
  name: string;
  score: number;
  completionRate: string;
};

type RoleDashboardModel = {
  stats: StatCard[];
  scoreTrend: ScoreTrendPoint[];
  topClasses: TopClassPoint[];
  submissionStatus: SubmissionStatusPoint[];
  topChartTitle: string;
  topChartDescription: string;
  rankingTitle: string;
  rankingRows: RowPoint[];
};

type DashboardStatApi = {
  label: string;
  value: string;
  note: string;
};

type DashboardOverviewApi = {
  role: DashboardRole;
  title: string;
  description: string;
  stats: DashboardStatApi[];
  scoreTrend: ScoreTrendPoint[];
  topClasses: TopClassPoint[];
  submissionStatus: SubmissionStatusPoint[];
  topChartTitle: string;
  topChartDescription: string;
  rankingTitle: string;
  rankingRows: RowPoint[];
};

const iconByStatLabel: Array<{ includes: string[]; icon: LucideIcon }> = [
  { includes: ["average", "score"], icon: TrendingUp },
  { includes: ["class"], icon: BookOpen },
  { includes: ["submission", "assignments"], icon: ClipboardCheck },
  { includes: ["completion"], icon: CheckCircle2 },
];

const resolveStatIcon = (label: string): LucideIcon => {
  const normalized = label.toLowerCase();
  const matched = iconByStatLabel.find((item) =>
    item.includes.some((needle) => normalized.includes(needle)),
  );
  return matched?.icon ?? TrendingUp;
};

const scoreTrendChartConfig = {
  averageScore: {
    label: "Average Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const topClassesChartConfig = {
  score: {
    label: "Average Score",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const submissionChartConfig = {
  status: {
    label: "Submission Status",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DashboardPageContent({
  role = "TEACHER",
  title: titleOverride,
  description: descriptionOverride,
}: DashboardPageContentProps) {
  const {
    data: analyticsResponse,
    isLoading,
  } = useGetData<APISingleResponse<DashboardOverviewApi>>({
    key: ["analytics", "dashboard", role],
    endpoint: "/analytics/dashboard",
    extractData: false,
    params: { weeks: 6 },
    errorMessage: "Failed to load dashboard analytics.",
  });

  const payload = analyticsResponse?.data;
  const title = titleOverride ?? payload?.title ?? "Dashboard";
  const description = descriptionOverride ?? payload?.description ?? "Overview of your activity.";
  const currentRole = payload?.role ?? role;
  const model: RoleDashboardModel = {
    stats:
      payload?.stats.map((stat) => ({
        ...stat,
        icon: resolveStatIcon(stat.label),
      })) ?? [],
    scoreTrend: payload?.scoreTrend ?? [],
    topClasses: payload?.topClasses ?? [],
    submissionStatus: payload?.submissionStatus ?? [],
    topChartTitle: payload?.topChartTitle ?? "Top Performing Classes",
    topChartDescription:
      payload?.topChartDescription ?? "Ranking by average score.",
    rankingTitle: payload?.rankingTitle ?? "Performance Ranking",
    rankingRows: payload?.rankingRows ?? [],
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-7">
        <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/5 text-primary">
          {currentRole} Dashboard
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
      </div>

      {isLoading ? (
        <Card className="border-border/70">
          <CardContent className="py-10 text-sm text-muted-foreground">
            Loading dashboard analytics...
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {model.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/70">
              <CardHeader className="pb-2">
                <CardDescription className="inline-flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Icon className="h-3.5 w-3.5" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl tracking-tight">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle>Average Score Trend</CardTitle>
            <CardDescription>Weekly score trend from recent assessments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scoreTrendChartConfig} className="h-[290px] w-full">
              <AreaChart data={model.scoreTrend} margin={{ left: 8, right: 8, top: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} width={34} domain={[0, 100]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area
                  dataKey="averageScore"
                  type="monotone"
                  fill="var(--color-averageScore)"
                  fillOpacity={0.24}
                  stroke="var(--color-averageScore)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Distribution of assignment submission status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={submissionChartConfig} className="h-[290px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Pie
                  data={model.submissionStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={102}
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle>{model.topChartTitle}</CardTitle>
            <CardDescription>{model.topChartDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={topClassesChartConfig} className="h-[290px] w-full">
              <BarChart data={model.topClasses} margin={{ left: 8, right: 8, top: 4 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="className" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} width={34} domain={[0, 100]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-score)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="inline-flex items-center gap-2">
              <Medal className="h-4 w-4" />
              {model.rankingTitle}
            </CardTitle>
            <CardDescription>Simple ranking list with score and completion rate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {model.rankingRows.map((row, index) => (
              <div key={row.name} className="rounded-xl border border-border/70 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{index + 1}. {row.name}</p>
                  <Badge variant="secondary">{row.score.toFixed(1)}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Completion Rate: {row.completionRate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
