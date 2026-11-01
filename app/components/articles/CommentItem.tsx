// components/articles/CommentItem.tsx
interface CommentItemProps {
  username: string;
  content: string;
  createdAt: Date;
}

export default function CommentItem({
  username,
  content,
  createdAt,
}: CommentItemProps) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar avec initiale */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Contenu du commentaire */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-foreground text-sm">
            {username}
          </span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-foreground text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}
