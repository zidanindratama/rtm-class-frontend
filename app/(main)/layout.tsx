import { Navbar } from "@/components/main/common/navbar";
import { Footer } from "@/components/main/common/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip bg-background selection:bg-primary/20">
      <div
        className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />
      <main className="relative z-10 flex-1 w-full overflow-x-clip pt-20">{children}</main>
      <Footer />
    </div>
  );
}
