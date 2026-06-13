"use client";

import { useState } from "react";
import Image from "next/image";
import CommentLikeButton from "./CommentLikeButton";
import ReplyInput from "./ReplyInput";

interface Reply {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
}

interface CommentItemProps {
  comment: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    likes: number;
    liked: boolean;
    time: string;
    replies?: Reply[];
  };
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [liked, setLiked] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(comment.replies || []);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleReply = (text: string) => {
    const reply: Reply = {
      id: `r${Date.now()}`,
      author: "You",
      avatar: "/assets/images/comment_img.png",
      text,
      likes: 0,
      liked: false,
      time: "just now",
    };
    setReplies([...replies, reply]);
    setShowReplyInput(false);
  };

  return (
    <div className="flex gap-3 mb-4">
      <Image src={comment.avatar} alt={comment.author} width={32} height={32} className="rounded-full w-8 h-8 object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="bg-[#F0F2F5] rounded-lg px-4 py-2.5">
          <a href="/profile" className="text-sm font-semibold text-[#212121] hover:text-[#1890FF]">
            {comment.author}
          </a>
          <p className="text-sm text-[#2D3748] mt-0.5">{comment.text}</p>
        </div>
        <div className="flex items-center gap-4 mt-1.5 px-1">
          <CommentLikeButton liked={liked} count={likesCount} onToggle={handleLike} />
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs text-[#666666] hover:text-[#1890FF]"
          >
            Reply
          </button>
          <span className="text-xs text-[#C4C4C4]">{comment.time}</span>
        </div>

        {replies.length > 0 && (
          <div className="ml-4 mt-3 space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Image src={reply.avatar} alt={reply.author} width={28} height={28} className="rounded-full w-7 h-7 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#F0F2F5] rounded-lg px-3 py-2">
                    <a href="/profile" className="text-xs font-semibold text-[#212121] hover:text-[#1890FF]">
                      {reply.author}
                    </a>
                    <p className="text-xs text-[#2D3748] mt-0.5">{reply.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <CommentLikeButton liked={reply.liked} count={reply.likes} onToggle={() => {}} />
                    <span className="text-xs text-[#C4C4C4]">{reply.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showReplyInput && (
          <div className="mt-3 ml-4">
            <ReplyInput onSubmit={handleReply} />
          </div>
        )}
      </div>
    </div>
  );
}
