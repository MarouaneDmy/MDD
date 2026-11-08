"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isOldest = searchParams.get("sort") === "oldest";

  function handleToggle() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", isOldest ? "recent" : "oldest");

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={
        isOldest
          ? "Trier par : plus anciens en premier"
          : "Trier par : plus récents en premier"
      }
      className="flex cursor-pointer items-center gap-2 font-bold text-black disabled:opacity-50"
    >
      Trier par
      {isOldest ? (
        <ArrowUp className="h-5 w-5" />
      ) : (
        <ArrowDown className="h-5 w-5" />
      )}
    </button>
  );
}
