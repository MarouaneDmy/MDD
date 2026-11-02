import Link from "next/link";
import { signOut, auth } from "@/auth";
import { UserIcon } from "lucide-react";

type HeaderVariant = "full" | "logo-only";

interface HeaderProps {
  variant?: HeaderVariant;
}

export default async function Header({ variant = "full" }: HeaderProps) {
  const session = await auth();

  const homeHref = session?.user ? "/feed" : "/";

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground text-2xl font-bold px-4 py-2 rounded-xl">
            MDD
          </div>
        </Link>

        {variant === "full" && session?.user && (
          <nav className="flex items-center gap-6">
            <Link
              href="/feed"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Articles
            </Link>
            <Link
              href="/themes"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Thèmes
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Se déconnecter
              </button>
            </form>

            {/* Lien vers le profil */}
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Mon profil"
            >
              <UserIcon className="w-5 h-5 text-foreground" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
