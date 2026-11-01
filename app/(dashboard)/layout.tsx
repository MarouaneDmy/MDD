import Header from "@/app/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="full" />
      <main>{children}</main>
    </div>
  );
}
