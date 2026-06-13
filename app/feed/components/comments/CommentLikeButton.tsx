"use client";

interface CommentLikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  onShowLikers?: () => void;
}

export default function CommentLikeButton({ liked, count, onToggle, onShowLikers }: CommentLikeButtonProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 text-xs ${
          liked ? "text-red-500" : "text-[#666666] hover:text-red-500"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      {count > 0 && (
        onShowLikers ? (
          <button onClick={onShowLikers} className="text-xs text-[#666666] hover:text-[#1890FF]">
            {count}
          </button>
        ) : (
          <span className="text-xs text-[#666666]">{count}</span>
        )
      )}
    </div>
  );
}
