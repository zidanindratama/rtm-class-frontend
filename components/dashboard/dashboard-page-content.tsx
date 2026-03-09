"use client";

import { BookOpen, CheckCircle2, ClipboardCheck, Medal, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";
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
  title: string;
  description: string;
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

const dashboardDataByRole: Record<DashboardRole, RoleDashboardModel> = {
  ADMIN: {
    stats: [
      { label: "Platform Average Score", value: "84.7", note: "Across Grade X, XI, and XII", icon: TrendingUp },
      { label: "Active Classes", value: "124", note: "Grade X: 44 | XI: 41 | XII: 39", icon: BookOpen },
      { label: "Submitted Assignments", value: "9,842", note: "Last 30 days", icon: ClipboardCheck },
      { label: "Completion Rate", value: "89.3%", note: "On-time submissions across all grades", icon: CheckCircle2 },
    ],
    scoreTrend: [
      { week: "W1", averageScore: 80.2 },
      { week: "W2", averageScore: 81.6 },
      { week: "W3", averageScore: 82.9 },
      { week: "W4", averageScore: 83.4 },
      { week: "W5", averageScore: 84.1 },
      { week: "W6", averageScore: 84.7 },
    ],
    topClasses: [
      { className: "XII-Science-1", score: 91.4 },
      { className: "XI-Science-2", score: 89.8 },
      { className: "X-Science-1", score: 88.5 },
      { className: "XI-Language-1", score: 87.9 },
      { className: "XII-Social-1", score: 86.7 },
    ],
    submissionStatus: [
      { name: "On Time", value: 72, fill: "var(--color-chart-1)" },
      { name: "Late", value: 20, fill: "var(--color-chart-2)" },
      { name: "Missing", value: 8, fill: "var(--color-chart-3)" },
    ],
    topChartTitle: "Top Performing Classes by Grade",
    topChartDescription: "Ranking of Grade X, XI, and XII classes by average score.",
    rankingTitle: "Top Performing Classes",
    rankingRows: [
      { name: "XII-Science-1", score: 91.4, completionRate: "96%" },
      { name: "XI-Science-2", score: 89.8, completionRate: "94%" },
      { name: "X-Science-1", score: 88.5, completionRate: "92%" },
      { name: "XI-Language-1", score: 87.9, completionRate: "91%" },
      { name: "XII-Social-1", score: 86.7, completionRate: "90%" },
    ],
  },
  TEACHER: {
    stats: [
      { label: "Class Average Score", value: "82.9", note: "Across your classes", icon: TrendingUp },
      { label: "Classes Taught", value: "8", note: "Only classes assigned to you", icon: BookOpen },
      { label: "Submissions This Week", value: "314", note: "From your assignments", icon: ClipboardCheck },
      { label: "Completion Rate", value: "87.1%", note: "On-time submissions in your classes", icon: CheckCircle2 },
    ],
    scoreTrend: [
      { week: "W1", averageScore: 78.4 },
      { week: "W2", averageScore: 79.1 },
      { week: "W3", averageScore: 80.6 },
      { week: "W4", averageScore: 81.7 },
      { week: "W5", averageScore: 82.1 },
      { week: "W6", averageScore: 82.9 },
    ],
    topClasses: [
      { className: "XI-Science-2", score: 88.9 },
      { className: "X-Science-1", score: 86.4 },
      { className: "XI-Language-1", score: 85.2 },
      { className: "X-Social-2", score: 84.7 },
      { className: "X-Language-1", score: 83.9 },
    ],
    submissionStatus: [
      { name: "On Time", value: 69, fill: "var(--color-chart-1)" },
      { name: "Late", value: 22, fill: "var(--color-chart-2)" },
      { name: "Missing", value: 9, fill: "var(--color-chart-3)" },
    ],
    topChartTitle: "Top Performing Classes You Teach",
    topChartDescription: "Ranking of your classes based on average score.",
    rankingTitle: "Your Class Ranking by Average Score",
    rankingRows: [
      { name: "XI-Science-2", score: 88.9, completionRate: "95%" },
      { name: "X-Science-1", score: 86.4, completionRate: "91%" },
      { name: "XI-Language-1", score: 85.2, completionRate: "90%" },
      { name: "X-Social-2", score: 84.7, completionRate: "88%" },
      { name: "X-Language-1", score: 83.9, completionRate: "87%" },
    ],
  },
  STUDENT: {
    stats: [
      { label: "Current Average Score", value: "88.6", note: "Your semester average", icon: TrendingUp },
      { label: "Enrolled Classes", value: "6", note: "Classes you joined", icon: BookOpen },
      { label: "Completed Assignments", value: "41", note: "Total submitted", icon: ClipboardCheck },
      { label: "Completion Rate", value: "90.2%", note: "Your on-time submissions", icon: CheckCircle2 },
    ],
    scoreTrend: [
      { week: "W1", averageScore: 84.1 },
      { week: "W2", averageScore: 85.3 },
      { week: "W3", averageScore: 86.2 },
      { week: "W4", averageScore: 87.4 },
      { week: "W5", averageScore: 88.1 },
      { week: "W6", averageScore: 88.6 },
    ],
    topClasses: [
      { className: "XI Mathematics", score: 92.3 },
      { className: "XI Biology", score: 90.4 },
      { className: "XI History", score: 88.7 },
      { className: "XI English", score: 87.5 },
      { className: "XI Physics", score: 85.9 },
    ],
    submissionStatus: [
      { name: "On Time", value: 75, fill: "var(--color-chart-1)" },
      { name: "Late", value: 18, fill: "var(--color-chart-2)" },
      { name: "Missing", value: 7, fill: "var(--color-chart-3)" },
    ],
    topChartTitle: "Top Subjects by Your Score",
    topChartDescription: "Your highest-scoring subjects from enrolled classes.",
    rankingTitle: "Top Grade XI Subjects by Score",
    rankingRows: [
      { name: "XI Mathematics", score: 92.3, completionRate: "98%" },
      { name: "XI Biology", score: 90.4, completionRate: "95%" },
      { name: "XI History", score: 88.7, completionRate: "92%" },
      { name: "XI English", score: 87.5, completionRate: "90%" },
      { name: "XI Physics", score: 85.9, completionRate: "88%" },
    ],
  },
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

export function DashboardPageContent({ role = "TEACHER", title, description }: DashboardPageContentProps) {
  const model = dashboardDataByRole[role];

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-7">
        <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/5 text-primary">
          {role} Dashboard
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
      </div>

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
                <YAxis tickLine={false} axisLine={false} tickMargin={10} width={34} domain={[60, 100]} />
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
                <YAxis tickLine={false} axisLine={false} tickMargin={10} width={34} domain={[60, 100]} />
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
