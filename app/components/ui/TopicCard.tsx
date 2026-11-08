interface TopicCardProps {
  name: string;
  description?: string | null;
  headingLevel?: "h2" | "h3";
  children?: React.ReactNode;
}

export default function TopicCard({
  name,
  description,
  headingLevel: Heading = "h2",
  children,
}: TopicCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg bg-[#F4F4F4] p-4 text-left">
      <Heading className="mb-3 text-base font-bold text-black">{name}</Heading>

      {description && (
        <p className="mb-4 line-clamp-3 text-sm leading-snug text-black">
          {description}
        </p>
      )}

      {children && (
        <div className="mt-auto flex justify-center">{children}</div>
      )}
    </article>
  );
}
