interface CommentItemProps {
  username: string;
  content: string;
}

export default function CommentItem({ username, content }: CommentItemProps) {
  return (
    <div className="flex items-start gap-4 pl-6 pr-12">
      <span className="w-52 shrink-0 break-words pt-1 text-sm text-black">
        {username}
      </span>
      <p className="flex-1 whitespace-pre-wrap rounded-2xl bg-[#EDEDED] p-4 text-sm text-black">
        {content}
      </p>
    </div>
  );
}
