// app/(dashboard)/articles/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import CommentItem from "@/app/components/articles/CommentItem";
import CommentForm from "@/app/components/articles/CommentForm";

const prisma = new PrismaClient();

// 👇 1. On déclare params comme une Promise
interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  // 👇 2. On attend (await) la résolution de la promesse pour récupérer l'ID
  const { id } = await params;

  // Récupérer l'article avec tous ses détails
  const article = await prisma.article.findUnique({
    where: { id }, // Maintenant, 'id' est bien une chaîne de caractères valide
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      topics: {
        include: {
          topic: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Si l'article n'existe pas, afficher 404
  if (!article) {
    notFound();
  }

  // Formater la date
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(article.createdAt));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Bouton retour et titre */}
      <div className="mb-8">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux articles</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
      </div>

      {/* Métadonnées */}
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{article.author.username}</span>
        </div>
        {article.topics.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{article.topics.map((t) => t.topic.name).join(", ")}</span>
          </div>
        )}
      </div>

      {/* Contenu de l'article */}
      <article className="prose prose-lg max-w-none mb-12">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {article.content}
        </p>
      </article>

      {/* Séparateur */}
      <hr className="border-border my-12" />

      {/* Section Commentaires */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Commentaires ({article.comments.length})
        </h2>

        {/* Liste des commentaires */}
        {article.comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        ) : (
          <div className="space-y-4 mb-8">
            {article.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                username={comment.author.username}
                content={comment.content}
                createdAt={comment.createdAt}
              />
            ))}
          </div>
        )}

        {/* Formulaire d'ajout de commentaire */}
        <CommentForm articleId={article.id} />
      </section>
    </div>
  );
}
