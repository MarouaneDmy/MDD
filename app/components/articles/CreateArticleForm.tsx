"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/app/actions/article.actions";
import BackTitle from "@/app/components/ui/BackTitle";
import PageContainer from "@/app/components/ui/PageContainer";
import { Button } from "@/app/components/ui/Button";

interface Topic {
  id: string;
  name: string;
  description: string | null;
}

interface CreateArticleFormProps {
  topics: Topic[];
}

const fieldStyles =
  "w-full rounded-lg border border-primary bg-white px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary";

export default function CreateArticleForm({ topics }: CreateArticleFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createArticle(formData);

    if (result.success && result.articleId) {
      router.push(`/articles/${result.articleId}`);
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setIsLoading(false);
  }

  return (
    <PageContainer>
      <BackTitle
        href="/feed"
        title="Créer un nouvel article"
        backLabel="Retour aux articles"
        centered
      />

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-3">
        <div>
          <label htmlFor="topics" className="sr-only">
            Thème
          </label>
          <select
            id="topics"
            name="topics"
            required
            defaultValue=""
            className={`${fieldStyles} cursor-pointer invalid:text-gray-500`}
          >
            <option value="" disabled>
              Sélectionner un thème
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id} className="text-black">
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="sr-only">
            Titre de l&apos;article
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={5}
            maxLength={200}
            placeholder="Titre de l'article"
            className={fieldStyles}
          />
        </div>

        <div>
          <label htmlFor="content" className="sr-only">
            Contenu de l&apos;article
          </label>
          <textarea
            id="content"
            name="content"
            required
            minLength={50}
            maxLength={5000}
            rows={12}
            placeholder="Contenu de l'article"
            className={`${fieldStyles} resize-none`}
          />
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button type="submit" disabled={isLoading} className="w-32">
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
