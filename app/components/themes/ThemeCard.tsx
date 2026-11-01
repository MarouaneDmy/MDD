"use client";

import { useState } from "react";
import { toggleSubscription } from "@/app/actions/theme.actions";

interface ThemeCardProps {
  id: string;
  name: string;
  description: string | null;
  isSubscribed: boolean;
  subscribersCount: number;
}

export default function ThemeCard({
  id,
  name,
  description,
  isSubscribed: initialIsSubscribed,
  subscribersCount: initialCount,
}: ThemeCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [subscribersCount, setSubscribersCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleSubscription() {
    setIsLoading(true);

    const result = await toggleSubscription(id);

    if (result.success) {
      const newStatus = !isSubscribed;
      setIsSubscribed(newStatus);
      setSubscribersCount((prev) => (newStatus ? prev + 1 : prev - 1));
    }

    setIsLoading(false);
  }

  return (
    <article className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-3">{name}</h2>

      {description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {subscribersCount} abonné{subscribersCount > 1 ? "s" : ""}
        </span>

        <button
          onClick={handleToggleSubscription}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isSubscribed
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isLoading ? "..." : isSubscribed ? "Déjà abonné" : "S'abonner"}
        </button>
      </div>
    </article>
  );
}
