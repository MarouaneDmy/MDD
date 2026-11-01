import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ArticleCard from "@/app/components/articles/ArticleCard";

const prisma = new PrismaClient();

export default async function FeedPage() {
  const articles = await prisma.article.findMany({
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Créer un article
        </Link>

        <div className="flex items-center gap-2 text-foreground">
          <span className="font-medium">Trier par</span>
          <select className="border border-border rounded px-3 py-2 bg-background">
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Aucun article pour le moment.</p>
          <p className="text-sm mt-2">Soyez le premier à publier !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              createdAt={article.createdAt}
              author={article.author}
            />
          ))}
        </div>
      )}
    </div>
  );
}
