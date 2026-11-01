// components/articles/ArticleCard.tsx
import Link from "next/link";
import Image from "next/image"; // 👈 Import du composant optimisé de Next.js
import { Calendar, User } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    username: string;
    avatarUrl?: string | null;
  };
}

export default function ArticleCard({
  id,
  title,
  content,
  createdAt,
  author,
}: ArticleCardProps) {
  // Tronquer le contenu à 150 caractères
  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) + "..." : content;

  // Formater la date en français
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  return (
    <Link href={`/articles/${id}`} className="block">
      <article className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow h-full">
        <h2 className="text-xl font-bold text-foreground mb-3">{title}</h2>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author.username}</span>
          </div>
        </div>

        <p className="text-foreground text-sm leading-relaxed">
          {truncatedContent}
        </p>
      </article>
    </Link>
  );
}
