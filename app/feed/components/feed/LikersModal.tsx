"use client";

import { useEffect, useRef } from "react";
import Avatar from "../shared/Avatar";

interface LikersModalProps {
  open: boolean;
  onClose: () => void;
  users: { name: string }[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function LikersModal({ open, onClose, users = [], hasMore, loadingMore, onLoadMore }: LikersModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div ref={ref} className="bg-white rounded-lg shadow-xl w-[320px] flex flex-col max-h-[400px]">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-semibold text-[#212121]">Liked by</h4>
          <button onClick={onClose} className="text-[#666666] hover:text-[#212121]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4 pt-3">
          {users.length === 0 ? (
            <p className="text-center text-sm text-[#666666] py-4">No likes yet</p>
          ) : (
            <ul className="space-y-3">
              {users.map((user, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Avatar name={user.name} size={32} />
                  <span className="text-sm text-[#212121]">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="w-full mt-3 py-2 text-sm text-[#1890FF] hover:bg-blue-50 rounded-md disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "View more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
