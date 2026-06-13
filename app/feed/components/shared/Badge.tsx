"use client";

interface BadgeProps {
  text: string;
  className?: string;
}

export default function Badge({ text, className = "" }: BadgeProps) {
  return (
    <span className={`bg-[#e8f4ff] text-[#1890FF] text-xs font-medium px-2 py-0.5 rounded ${className}`}>
      {text}
    </span>
  );
}
