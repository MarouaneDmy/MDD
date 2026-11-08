"use client";

import { useState } from "react";
import { toggleSubscription } from "@/app/actions/theme.actions";
import { Button } from "@/app/components/ui/Button";

interface ThemeCardProps {
  id: string;
  name: string;
  description: string | null;
  isSubscribed: boolean;
}

export default function ThemeCard({
  id,
  name,
  description,
  isSubscribed: initialIsSubscribed,
}: ThemeCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);

    const result = await toggleSubscription(id);

    if (result.success) {
      setIsSubscribed(true);
    }

    setIsLoading(false);
  }

  return (
    <article className="flex h-full flex-col rounded-lg bg-[#F4F4F4] p-4">
      <h2 className="mb-3 text-base font-bold text-black">{name}</h2>

      {description && (
        <p className="mb-4 line-clamp-3 text-sm leading-snug text-black">
          {description}
        </p>
      )}

      <div className="mt-auto flex justify-center">
        <Button
          onClick={handleSubscribe}
          disabled={isLoading || isSubscribed}
          variant={isSubscribed ? "secondary" : "primary"}
          className="w-32"
        >
          {isLoading ? "..." : isSubscribed ? "Déjà abonné" : "S'abonner"}
        </Button>
      </div>
    </article>
  );
}
