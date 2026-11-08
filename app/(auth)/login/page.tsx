// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Input } from "@/app/components/ui/Input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    } else {
      window.location.href = "/feed";
    }
  }

  return (
    <div className="bg-background flex flex-col">
      <div className="px-4 md:px-10 py-2 flex items-center gap-4">
        <Link href="/">
          <MoveLeft className="w-10 h-10" />
        </Link>

        <h1 className="text-3xl text-foreground flex-1 text-center pr-16 pt-8">
          Se connecter
        </h1>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-12">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail ou nom d'utilisateur"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              required
            />

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-[139px] h-[40px] bg-[#7763C5] text-white font-bold rounded-lg hover:bg-[#6a55b5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
