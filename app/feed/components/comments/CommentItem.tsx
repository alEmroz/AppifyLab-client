"use client";

import { useState } from "react";
import Avatar from "../shared/Avatar";
import CommentLikeButton from "./CommentLikeButton";
import ReplyInput from "./ReplyInput";
import WhoLikedModal from "../feed/WhoLikedModal";
import ConfirmModal from "../shared/ConfirmModal";
import { toggleLikeComment, replyToComment, fetchCommentLikers, deleteComment } from "../../api";
import type { Comment } from "../../api";
import { getUser } from "@/lib/api";

interface CommentItemProps {
  comment: Comment;
  onCommentAdded?: () => void;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, onCommentAdded, onDelete }: CommentItemProps) {
  const [liked, setLiked] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [showLikers, setShowLikers] = useState(false);
  const [likersList, setLikersList] = useState<{ name: string }[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const currentUser = getUser();

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const result = await toggleLikeComment(comment.id);
      setLiked(result.is_liked);
      setLikesCount(result.likes_count);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleReplyLike = async (replyId: string, wasLiked: boolean, prevCount: number) => {
    setReplies((prev) =>
      prev.map((r) =>
        r.id === replyId ? { ...r, liked: !wasLiked, likes: wasLiked ? prevCount - 1 : prevCount + 1 } : r,
      ),
    );
    try {
      const result = await toggleLikeComment(replyId);
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, liked: result.is_liked, likes: result.likes_count } : r)),
      );
    } catch {
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId ? { ...r, liked: wasLiked, likes: prevCount } : r,
        ),
      );
    }
  };

  const handleReply = async (text: string) => {
    try {
      const newReply = await replyToComment(comment.id, text);
      const reply: Comment = {
        id: newReply.id,
        author: newReply.author,
        text: newReply.text,
        time: newReply.time,
        likes: newReply.likes,
        liked: newReply.liked,
        replies: [],
        userUuid: newReply.userUuid,
      };
      setReplies([...replies, reply]);
      setShowReplyInput(false);
      onCommentAdded?.();
    } catch {
      // silently fail
    }
  };

  const handleShowLikers = async () => {
    try {
      const users = await fetchCommentLikers(comment.id);
      setLikersList(users);
    } catch {
      setLikersList([]);
    }
    setShowLikers(true);
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onDelete?.(comment.id);
    } catch {
      // silently fail
    }
    setShowDeleteConfirm(false);
  };

  const isOwner = currentUser?.uuid === comment.userUuid;

  return (
    <div className="flex gap-3 mb-4">
      <Avatar name={comment.author} size={32} />
      <div className="flex-1 min-w-0">
        <div className="bg-[#F0F2F5] rounded-lg px-4 py-2.5">
          <a href="/profile" className="text-sm font-semibold text-[#212121] hover:text-[#1890FF]">
            {comment.author}
          </a>
          <p className="text-sm text-[#2D3748] mt-0.5">{comment.text}</p>
        </div>
        <div className="flex items-center gap-4 mt-1.5 px-1">
          <CommentLikeButton liked={liked} count={likesCount} onToggle={handleLike} onShowLikers={handleShowLikers} />
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs text-[#666666] hover:text-[#1890FF]"
          >
            Reply
          </button>
          <span className="text-xs text-[#C4C4C4]">{comment.time}</span>
          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-[#C4C4C4] hover:text-red-500 ml-auto"
              title="Delete comment"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>

        {replies.length > 0 && (
          <div className="ml-4 mt-3 space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar name={reply.author} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#F0F2F5] rounded-lg px-3 py-2">
                    <a href="/profile" className="text-xs font-semibold text-[#212121] hover:text-[#1890FF]">
                      {reply.author}
                    </a>
                    <p className="text-xs text-[#2D3748] mt-0.5">{reply.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <CommentLikeButton
                      liked={reply.liked}
                      count={reply.likes}
                      onToggle={() => handleReplyLike(reply.id, reply.liked, reply.likes)}
                      onShowLikers={handleShowLikers}
                    />
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

      <WhoLikedModal open={showLikers} onClose={() => setShowLikers(false)} users={likersList} />
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete comment?"
        message="This will also delete all replies."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
