"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`text-lg transition-colors ${
        isActive ? "text-primary" : "text-black hover:text-primary"
      }`}
    >
      {children}
    </Link>
  );
}
