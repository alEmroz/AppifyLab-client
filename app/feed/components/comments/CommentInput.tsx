"use client";

import { useState } from "react";
import Avatar from "../shared/Avatar";
import { getUser } from "@/lib/api";

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function CommentInput({
  onSubmit,
  placeholder = "Write a comment",
  inputRef,
}: CommentInputProps) {
  const user = getUser();
  const name = user ? `${user.first_name} ${user.last_name}` : "You";
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <Avatar name={name} size={28} />
      <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-1.5">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 text-sm text-[#212121] placeholder:text-[#666666] focus:ring-0"
        />
      </div>
    </form>
  );
}
