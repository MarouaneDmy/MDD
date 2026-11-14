"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import AuthHeading from "@/app/components/ui/AuthHeading";
import { Button } from "@/app/components/ui/Button";
import PasswordRequirements from "@/app/components/ui/PasswordRequirements";
import { registerUser } from "@/app/actions/auth.actions";
import { PASSWORD_RULES } from "@/lib/validations/password-rules";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = PASSWORD_RULES.every((rule) => rule.test(password));

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.success) {
      router.push("/login");
    } else {
      setError(result.error ?? "Une erreur est survenue");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <AuthHeading title="Inscription" />

      <div className="flex justify-center px-6 pb-12 pt-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <Input
            id="username"
            name="username"
            type="text"
            label="Nom d'utilisateur"
            autoComplete="username"
            minLength={3}
            required
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Adresse e-mail"
            autoComplete="email"
            required
          />

          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              autoComplete="new-password"
              aria-describedby="password-rules"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordRequirements id="password-rules" value={password} />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-36"
            >
              {isLoading ? "..." : "S'inscrire"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
