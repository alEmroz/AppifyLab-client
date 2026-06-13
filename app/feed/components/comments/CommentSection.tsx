"use client";

import { useState, useEffect } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { fetchComments, addComment, Comment } from "../../api";

interface CommentSectionProps {
  postUuid: string;
}

export default function CommentSection({ postUuid }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchComments(postUuid);
        setComments(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [postUuid]);

  const handleAddComment = async (text: string) => {
    try {
      const newComment = await addComment(postUuid, text);
      setComments([newComment, ...comments]);
    } catch {
      // silently fail
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="px-6 pb-4">
      <CommentInput onSubmit={handleAddComment} />

      {loading && (
        <div className="text-sm text-[#666666] mt-3">Loading comments...</div>
      )}

      {!loading && comments.length > 2 && !showAll && (
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
