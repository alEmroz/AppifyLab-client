"use client";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-8 text-[#666666] text-sm ${className}`}>
      {message}
    </div>
  );
}
