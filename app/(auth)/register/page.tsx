"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { registerUser } from "@/app/actions/auth.actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("🚀 [CLIENT] Tentative d'inscription...");
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    console.log(" [CLIENT] Réponse du serveur:", result);

    if (result.success) {
      console.log("✅ [CLIENT] Succès, redirection vers /login");
      window.location.href = "/login";
    } else {
      console.log("❌ [CLIENT] Échec de l'inscription:", result.error);
      setError(result.error ?? "Une erreur est survenue");
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-background flex flex-col">
      <div className="px-4 md:px-10 py-2 flex items-center gap-4">
        <Link href="/">
          <MoveLeft className="w-10 h-10" />
        </Link>

        <h1 className="text-3xl text-foreground flex-1 text-center pr-16 pt-8">
          {"S'inscrire"}
        </h1>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-12">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
            />

            {/* Input Username */}
            <Input
              id="username"
              name="username"
              type="text"
              label="Nom d'utilisateur"
              minLength={3}
              required
            />

            {/* Input Password */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              minLength={8}
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
                {isLoading ? "..." : "S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
