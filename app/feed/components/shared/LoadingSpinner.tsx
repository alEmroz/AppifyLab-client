"use client";

export default function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div className="w-8 h-8 border-4 border-[#1890FF] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
