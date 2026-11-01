// components/articles/CommentForm.tsx
"use client";

import { useState } from "react";
import { addComment } from "@/app/actions/comment.actions";
import { Send } from "lucide-react";

interface CommentFormProps {
  articleId: string;
}

export default function CommentForm({ articleId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("articleId", articleId);

    const result = await addComment(formData);

    if (result.success) {
      setContent(""); // Réinitialiser le formulaire
    } else {
      setError(result.error ?? null);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez ici votre commentaire"
            rows={3}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground resize-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="self-end p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
