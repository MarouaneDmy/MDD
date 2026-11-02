"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Récupère la valeur actuelle dans l'URL, ou "recent" par défaut
  const currentSort = searchParams.get("sort") || "recent";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);

    // startTransition permet de mettre à jour l'URL sans bloquer le thread principal
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <select
      name="sort"
      aria-label="Trier les articles"
      value={currentSort}
      onChange={handleChange}
      disabled={isPending}
      className="border border-border rounded px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer disabled:opacity-50"
    >
      <option value="recent">Plus récents</option>
      <option value="oldest">Plus anciens</option>
    </select>
  );
}
