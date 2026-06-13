"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface Reply {
  id: string;
  author: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
}

interface CommentData {
  id: string;
  author: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
  replies?: Reply[];
}

interface CommentSectionProps {
  comments: CommentData[];
  onAddComment: (text: string) => void;
}

export default function CommentSection({ comments: initialComments, onAddComment }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [showAll, setShowAll] = useState(false);

  const handleAddComment = (text: string) => {
    const newComment: CommentData = {
      id: `c${Date.now()}`,
      author: "You",
      text,
      likes: 0,
      liked: false,
      time: "just now",
      replies: [],
    };
    setComments([newComment, ...comments]);
    onAddComment(text);
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="px-6 pb-4">
      <CommentInput onSubmit={handleAddComment} />

      {comments.length > 2 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm text-[#1890FF] mt-3 hover:underline"
        >
          View {comments.length - 2} previous comments
        </button>
      )}

      <div className="mt-4">
        {visibleComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
