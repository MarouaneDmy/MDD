import Link from "next/link";

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
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  return (
    <Link href={`/articles/${id}`} className="block h-full">
      <article className="h-full rounded-lg bg-[#F4F4F4] p-4 transition-shadow hover:shadow-md">
        <h2 className="mb-3 text-base font-bold text-black">{title}</h2>

        <div className="mb-3 flex text-sm text-black">
          <span className="w-40 shrink-0">{formattedDate}</span>
          <span>{author.username}</span>
        </div>

        <p className="line-clamp-4 text-sm leading-snug text-black">
          {content}
        </p>
      </article>
    </Link>
  );
}
