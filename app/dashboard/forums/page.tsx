import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardForumsPage() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Forums</CardTitle>
        <CardDescription>
          Join class discussions, share updates, and collaborate with the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Open class-specific forum threads from each class detail page.
      </CardContent>
    </Card>
  );
}
