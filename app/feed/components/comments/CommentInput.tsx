"use client";

import { useState } from "react";
import Image from "next/image";

interface CommentInputProps {
  avatar?: string;
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export default function CommentInput({
  avatar = "/assets/images/comment_img.png",
  onSubmit,
  placeholder = "Write a comment",
}: CommentInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <Image src={avatar} alt="" width={28} height={28} className="rounded-full w-7 h-7 object-cover flex-shrink-0" />
      <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-1.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 text-sm text-[#212121] placeholder:text-[#666666] focus:ring-0"
        />
        <div className="flex items-center gap-1 ml-2">
          <button type="button" className="p-1 text-[#666666] hover:text-[#1890FF]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill="currentColor" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
            </svg>
          </button>
          <button type="button" className="p-1 text-[#666666] hover:text-[#1890FF]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill="currentColor" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
