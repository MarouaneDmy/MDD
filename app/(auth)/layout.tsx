import Header from "@/app/components/layout/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="logo-only" />
      <main>{children}</main>
    </div>
  );
}
