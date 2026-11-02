// app/components/articles/CreateArticleForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createArticle } from "@/app/actions/article.actions";
import { ArrowLeft } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  description: string | null;
}

interface CreateArticleFormProps {
  topics: Topic[];
}

export default function CreateArticleForm({ topics }: CreateArticleFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Ajouter les topics sélectionnés au FormData
    selectedTopics.forEach((topicId) => {
      formData.append("topics", topicId);
    });

    const result = await createArticle(formData);

    if (result.success && result.articleId) {
      router.push(`/articles/${result.articleId}`);
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setIsLoading(false);
  }

  function handleTopicChange(topicId: string) {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Bouton retour */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </Link>

      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-foreground text-center mb-8">
        Créer un nouvel article
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection des thèmes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thèmes
          </label>
          <div className="space-y-2">
            {topics.map((topic) => (
              <label
                key={topic.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  value={topic.id}
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => handleTopicChange(topic.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-foreground">
                    {topic.name}
                  </span>
                  {topic.description && (
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
          {selectedTopics.length === 0 && (
            <p className="text-red-500 text-sm mt-2">
              Veuillez sélectionner au moins un thème
            </p>
          )}
        </div>

        {/* Titre de l'article */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {"Titre de l'article"}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={5}
            maxLength={200}
            placeholder="Titre de l'article"
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
          />
        </div>

        {/* Contenu de l'article */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-foreground mb-2"
          >
            {"Contenu de l'article"}
          </label>
          <textarea
            id="content"
            name="content"
            required
            minLength={50}
            maxLength={5000}
            rows={8}
            placeholder="Contenu de l'article"
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground resize-none"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Minimum 50 caractères
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isLoading || selectedTopics.length === 0}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création en cours..." : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}
