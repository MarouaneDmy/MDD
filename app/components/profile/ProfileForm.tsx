"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile.actions";
import TextField from "@/app/components/ui/TextField";
import { Button } from "@/app/components/ui/Button";

interface ProfileFormProps {
  username: string;
  email: string;
}

export default function ProfileForm({
  username: initialUsername,
  email: initialEmail,
}: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const form = e.currentTarget;
    const result = await updateProfile(new FormData(form));

    if (result.success) {
      setSuccess(true);
      const passwordInput = form.elements.namedItem(
        "password",
      ) as HTMLInputElement | null;
      if (passwordInput) passwordInput.value = "";
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
      <TextField
        id="username"
        name="username"
        label="Username"
        type="text"
        placeholder="Username"
        defaultValue={initialUsername}
        autoComplete="username"
        required
        minLength={3}
        maxLength={50}
      />

      <TextField
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="email@email.fr"
        defaultValue={initialEmail}
        autoComplete="email"
        required
      />

      <TextField
        id="password"
        name="password"
        label="Mot de passe (laisser vide pour conserver le mot de passe actuel)"
        type="password"
        placeholder="Mot de passe"
        autoComplete="new-password"
        minLength={8}
      />

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-600">
          Profil mis à jour avec succès !
        </div>
      )}

      <div className="flex justify-center pt-3">
        <Button type="submit" disabled={isLoading} className="w-32">
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
}
