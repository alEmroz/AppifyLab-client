"use client";

import { useState } from "react";
import Avatar from "../shared/Avatar";
import { getUser } from "@/lib/api";

interface ReplyInputProps {
  onSubmit: (text: string) => void;
}

export default function ReplyInput({ onSubmit }: ReplyInputProps) {
  const [text, setText] = useState("");
  const user = getUser();
  const name = user ? `${user.first_name} ${user.last_name}` : "You";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Avatar name={name} size={24} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 bg-[#F0F2F5] border-0 rounded-full px-3 py-1.5 text-sm text-[#212121] placeholder:text-[#666666] focus:ring-0"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="text-xs text-[#1890FF] font-medium disabled:opacity-50"
      >
        Reply
      </button>
    </form>
  );
}
