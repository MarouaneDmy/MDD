import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import BackTitle from "@/app/components/ui/BackTitle";
import CommentItem from "@/app/components/articles/CommentItem";
import CommentForm from "@/app/components/articles/CommentForm";
import { formatDate } from "@/lib/formatDate";
import PageContainer from "@/app/components/ui/PageContainer";

const prisma = new PrismaClient();

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { username: true, avatarUrl: true } },
      topics: { include: { topic: true } },
      comments: {
        include: { author: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <PageContainer>
      <BackTitle
        href="/feed"
        title={article.title}
        backLabel="Retour aux articles"
      />

      <div className="mt-4 md:pl-14">
        <article>
          <div className="mb-5 flex flex-wrap gap-x-10 gap-y-1 text-sm text-black">
            <span>{formatDate(article.createdAt)}</span>
            <span>{article.author.username}</span>
            {article.topics.length > 0 && (
              <span>{article.topics.map((t) => t.topic.name).join(", ")}</span>
            )}
          </div>

          <p className="whitespace-pre-wrap text-sm leading-snug text-black">
            {article.content}
          </p>
        </article>

        <hr className="my-6 border-gray-500" />

        <section>
          <h2 className="mb-4 text-sm text-black">Commentaires</h2>

          {article.comments.length === 0 ? (
            <p className="mb-6 pl-6 text-sm text-gray-500">
              Aucun commentaire pour le moment.
            </p>
          ) : (
            <div className="mb-6 space-y-4">
              {article.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  username={comment.author.username}
                  content={comment.content}
                />
              ))}
            </div>
          )}

          <CommentForm articleId={article.id} />
        </section>
      </div>
    </PageContainer>
  );
}
