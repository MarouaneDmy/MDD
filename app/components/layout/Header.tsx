import Link from "next/link";
import Image from "next/image";
import { signOut, auth } from "@/auth";
import { UserIcon } from "lucide-react";
import NavLink from "./NavLink";

type HeaderVariant = "full" | "logo-only";

interface HeaderProps {
  variant?: HeaderVariant;
}

export default async function Header({ variant = "full" }: HeaderProps) {
  const session = await auth();
  const homeHref = session?.user ? "/feed" : "/";

  return (
    <header
      className={`border-b border-black ${
        variant === "logo-only" ? "hidden md:block" : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <Link href={homeHref} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo Monde de Dév"
            width={110}
            height={64}
            className="h-auto object-contain"
            priority
          />
        </Link>

        {variant === "full" && session?.user && (
          <nav className="flex items-center gap-6">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="cursor-pointer text-sm font-bold text-red-800 transition-colors hover:text-red-600"
              >
                Se déconnecter
              </button>
            </form>

            <NavLink href="/feed">Articles</NavLink>
            <NavLink href="/themes">Thèmes</NavLink>

            <Link
              href="/profile"
              aria-label="Mon profil"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
            >
              <UserIcon className="h-5 w-5 text-gray-600" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
