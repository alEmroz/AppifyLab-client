"use client";

interface CommentLikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  onShowLikers?: () => void;
}

export default function CommentLikeButton({ liked, count, onToggle, onShowLikers }: CommentLikeButtonProps) {
  return (
    <div className="absolute right-0 bottom-0 translate-y-1/2 flex items-center gap-0.5 bg-white shadow-lg rounded-xl px-3 py-1 cursor-pointer z-10" onClick={onToggle}>
      <span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "red" : "none"} stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </span>
      {count > 0 && (
        <span className="text-sm font-medium text-[#212121] ml-1">{count}</span>
      )}
    </div>
  );
}
