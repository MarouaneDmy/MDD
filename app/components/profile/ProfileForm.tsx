// app/components/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile.actions";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      // Réinitialiser le champ mot de passe
      const passwordInput = document.getElementById(
        "password",
      ) as HTMLInputElement;
      if (passwordInput) passwordInput.value = "";
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={initialUsername}
          required
          minLength={3}
          maxLength={50}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={initialEmail}
          required
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Laisser vide pour conserver le mot de passe actuel"
          minLength={8}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Laissez ce champ vide si vous ne souhaitez pas changer votre mot de
          passe
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">
          Profil mis à jour avec succès !
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
        </button>
      </div>
    </form>
  );
}
