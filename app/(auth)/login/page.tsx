"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/app/components/ui/Input";
import AuthHeading from "@/app/components/ui/AuthHeading";
import { Button } from "@/app/components/ui/Button";

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
    <div className="flex flex-col">
      <AuthHeading title="Se connecter" />

      <div className="flex justify-center px-6 pb-12 pt-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button type="submit" disabled={isLoading} className="w-36">
              {isLoading ? "..." : "Se connecter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
