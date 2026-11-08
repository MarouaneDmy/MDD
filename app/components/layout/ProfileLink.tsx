"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon } from "lucide-react";

export default function ProfileLink() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/profile");

  return (
    <Link
      href="/profile"
      aria-label="Mon profil"
      aria-current={isActive ? "page" : undefined}
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gray-300 transition-colors ${
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-gray-600 hover:bg-gray-400"
      }`}
    >
      <UserIcon className="h-5 w-5" />
    </Link>
  );
}
