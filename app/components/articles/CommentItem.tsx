interface CommentItemProps {
  username: string;
  content: string;
}

export default function CommentItem({ username, content }: CommentItemProps) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4 md:pl-6 md:pr-12">
      <span className="break-words text-right text-sm text-black md:w-52 md:shrink-0 md:pt-1 md:text-left">
        {username}
      </span>
      <p className="whitespace-pre-wrap break-words rounded-2xl bg-[#EDEDED] p-4 text-sm text-black md:flex-1">
        {content}
      </p>
    </div>
  );
}
