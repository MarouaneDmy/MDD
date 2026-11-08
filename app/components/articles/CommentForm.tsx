"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { addComment } from "@/app/actions/comment.actions";

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
      setContent("");
    } else {
      setError(result.error ?? null);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="md:pl-6">
      <div className="flex items-center gap-3 md:gap-4">
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez ici votre commentaire"
          rows={3}
          required
          className="flex-1 resize-none rounded-2xl border border-black bg-white p-4 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          aria-label="Envoyer le commentaire"
          disabled={isLoading || !content.trim()}
          className="shrink-0 cursor-pointer text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
        >
          <Send className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.5} />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
