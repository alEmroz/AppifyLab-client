"use client";

import { useState } from "react";
import Avatar from "../shared/Avatar";
import CommentLikeButton from "./CommentLikeButton";
import ReplyInput from "./ReplyInput";
import LikersModal from "../feed/LikersModal";
import ConfirmModal from "../shared/ConfirmModal";
import { toast } from "react-toastify";
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
  const [likersCursor, setLikersCursor] = useState<string | null>(null);
  const [loadingLikers, setLoadingLikers] = useState(false);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      toast.error("Couldn't add your reply. Try again.");
      console.error(err);
    }
  };

  const handleShowLikers = async () => {
    setLoadingLikers(true);
    try {
      const result = await fetchCommentLikers(comment.id);
      setLikersList(result.users);
      setLikersCursor(result.nextCursor);
    } catch (err) {
      console.error(err);
      setLikersList([]);
    } finally {
      setLoadingLikers(false);
    }
    setShowLikers(true);
  };

  const handleLoadMoreLikers = async () => {
    if (!likersCursor || loadingLikers) return;
    setLoadingLikers(true);
    try {
      const result = await fetchCommentLikers(comment.id, likersCursor);
      setLikersList((prev) => [...prev, ...result.users]);
      setLikersCursor(result.nextCursor);
    } catch (err) {
      toast.error("Couldn't load likes.");
      console.error(err);
    } finally {
      setLoadingLikers(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onDelete?.(comment.id);
      toast.success("Comment deleted successfully.");
    } catch (err) {
      toast.error("Couldn't delete the comment. Try again.");
      console.error(err);
    }
    setShowDeleteConfirm(false);
  };

  const handleReplyDelete = async (replyId: string) => {
    try {
      await deleteComment(replyId);
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      toast.success("Reply deleted successfully.");
    } catch (err) {
      toast.error("Couldn't delete the reply. Try again.");
      console.error(err);
    }
  };

  const isOwner = currentUser?.uuid === comment.userUuid;

  return (
    <div className="flex gap-3 mb-6">
      <Avatar name={comment.author} size={40} />
      <div className="flex-1 min-w-0">
        <div className="bg-[#F6F6F6] rounded-[18px] px-3 py-3 relative mb-2">
          <a href="/profile" className="text-sm font-semibold text-[#212121] hover:text-[#1890FF]">
            {comment.author}
          </a>
          <p className="text-sm text-[#2D3748] mt-0.5">{comment.text}</p>
          <CommentLikeButton liked={liked} count={likesCount} onToggle={handleLike} onShowLikers={handleShowLikers} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleLike} className="text-sm font-medium text-[#212121] hover:underline">
            Like
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-sm font-medium text-[#212121] hover:underline"
          >
            Reply
          </button>
          <span className="text-sm font-medium text-[#212121]">Share</span>
          <span className="text-sm text-[#666666]">{comment.time}</span>
          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-[#C4C4C4] hover:text-red-500"
              title="Delete comment"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <div className="bg-[#F6F6F6] rounded-[18px] px-3 py-2 relative mb-5">
                    <a href="/profile" className="text-xs font-semibold text-[#212121] hover:text-[#1890FF]">
                      {reply.author}
                    </a>
                    <p className="text-xs text-[#2D3748] mt-0.5">{reply.text}</p>
                    <div onClick={() => handleReplyLike(reply.id, reply.liked, reply.likes)} className="absolute right-0 bottom-0 translate-y-1/2 flex items-center gap-0.5 bg-white shadow-lg rounded-xl px-3 py-1 cursor-pointer z-10">
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={reply.liked ? "red" : "none"} stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </span>
                      {reply.likes > 0 && (
                        <span className="text-sm font-medium text-[#212121] ml-0.5">{reply.likes}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#666666]">{reply.time}</span>
                    {currentUser?.uuid === reply.userUuid && (
                      <button
                        onClick={() => handleReplyDelete(reply.id)}
                        className="text-xs text-[#C4C4C4] hover:text-red-500"
                        title="Delete reply"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showReplyInput && (
          <div className="mt-3">
            <ReplyInput onSubmit={handleReply} />
          </div>
        )}
      </div>

      <LikersModal
        open={showLikers}
        onClose={() => setShowLikers(false)}
        users={likersList}
        hasMore={!!likersCursor}
        loadingMore={loadingLikers}
        onLoadMore={handleLoadMoreLikers}
      />
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
