import { PrismaClient } from "@prisma/client";
import ArticleCard from "@/app/components/articles/ArticleCard";
import SortSelect from "@/app/components/feed/SortSelect";
import { Button } from "@/app/components/ui/Button";

const prisma = new PrismaClient();

interface FeedPageProps {
  searchParams: Promise<{
    sort?: string;
  }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const resolvedSearchParams = await searchParams;
  const sortParam = resolvedSearchParams.sort;

  // On détermine l'ordre pour Prisma
  const orderByDirection = sortParam === "oldest" ? "asc" : "desc";

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
      createdAt: orderByDirection,
    },
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <Button href="/articles/new">Créer un article</Button>
        <div className="flex w-full justify-center md:w-auto md:justify-end">
          <SortSelect />
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg">Aucun article pour le moment.</p>
          <p className="mt-2 text-sm">Soyez le premier à publier !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
