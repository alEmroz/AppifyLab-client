"use client";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export default function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
        liked
          ? "text-[#1890FF] bg-[#e8f4ff]"
          : "text-[#666666] hover:bg-gray-100"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#1890FF" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      <span>{count}</span>
    </button>
  );
}
