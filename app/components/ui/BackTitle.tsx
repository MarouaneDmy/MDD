import Link from "next/link";
import { MoveLeft } from "lucide-react";

interface BackTitleProps {
  href: string;
  title: string;
  backLabel?: string;
  centered?: boolean;
}

export default function BackTitle({
  href,
  title,
  backLabel = "Retour",
  centered = false,
}: BackTitleProps) {
  const arrow = (
    <Link href={href} aria-label={backLabel} className="shrink-0">
      <MoveLeft className="h-8 w-8 text-black" strokeWidth={1.5} />
    </Link>
  );

  if (centered) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute left-0">{arrow}</div>
        <h1 className="text-lg font-bold text-black">{title}</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      {arrow}
      <h1 className="text-lg font-bold text-black">{title}</h1>
    </div>
  );
}
