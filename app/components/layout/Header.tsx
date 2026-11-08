import Link from "next/link";
import Image from "next/image";
import { signOut, auth } from "@/auth";
import HeaderNav from "./HeaderNav";
import NavLink from "./NavLink";
import ProfileLink from "./ProfileLink";

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
      <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
        <Link href={homeHref} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo Monde de Dév"
            width={110}
            height={64}
            className="h-auto w-20 object-contain md:w-28"
            priority
          />
        </Link>

        {variant === "full" && session?.user && (
          <HeaderNav>
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

            {/* Avatar : en bas de la sidebar sur mobile */}
            <div className="mt-auto md:mt-0">
              <ProfileLink />
            </div>
          </HeaderNav>
        )}
      </div>
    </header>
  );
}
