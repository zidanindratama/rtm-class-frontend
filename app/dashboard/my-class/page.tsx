import { MyClassGrid } from "@/components/dashboard/my-class/my-class-grid";

export default function DashboardMyClassPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Classes</h1>
        <p className="text-sm text-muted-foreground">
          Review your classes, members, and class health in one place.
        </p>
      </div>
      <MyClassGrid />
    </section>
  );
}
