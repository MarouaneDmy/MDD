"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Appel à la fonction signIn de NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // On gère la redirection nous-même
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    } else {
      // Succès : redirection vers le fil d'actualité (ou la page d'accueil)
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Connexion à MDD
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
              placeholder="marouane@mdd.dev"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            {"S'inscrire"}
          </Link>
        </p>
      </div>
    </div>
  );
}
