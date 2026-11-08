interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`w-full px-4 py-6 md:px-10 ${className}`}>{children}</div>
  );
}
