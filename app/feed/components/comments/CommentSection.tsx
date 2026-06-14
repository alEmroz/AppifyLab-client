"use client";

import { useState, useEffect, useRef } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { fetchComments, addComment, Comment } from "../../api";

interface CommentSectionProps {
  postUuid: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onCommentAdded?: () => void;
  onDeleteComment?: (commentId: string) => void;
}

export default function CommentSection({ postUuid, inputRef, onCommentAdded, onDeleteComment }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasBeenVisible) return;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchComments(postUuid);
        setComments(result.comments);
        setNextCursor(result.nextCursor);
      } catch {
        console.error("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    })();
  }, [postUuid, hasBeenVisible]);

  const loadMoreComments = async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const result = await fetchComments(postUuid, nextCursor);
      setComments((prev) => [...prev, ...result.comments]);
      setNextCursor(result.nextCursor);
    } catch {
      console.error("Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onDeleteComment?.(commentId);
  };

  const handleAddComment = async (text: string) => {
    try {
      const newComment = await addComment(postUuid, text);
      setComments([newComment, ...comments]);
      onCommentAdded?.();
    } catch {
      console.error("Failed to add comment");
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="px-6 pb-4">
      <div ref={sentinelRef} />
      {hasBeenVisible && (
        <>
          <CommentInput onSubmit={handleAddComment} inputRef={inputRef} />

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
              <CommentItem key={comment.id} comment={comment} onCommentAdded={onCommentAdded} onDelete={handleDeleteComment} />
            ))}
          </div>

          {showAll && nextCursor && !loadingMore && (
            <button
              onClick={loadMoreComments}
              className="text-sm text-[#1890FF] mt-3 hover:underline"
            >
              Load more comments
            </button>
          )}

          {loadingMore && (
            <div className="text-sm text-[#666666] mt-3">Loading more...</div>
          )}
        </>
      )}
    </div>
  );
}
