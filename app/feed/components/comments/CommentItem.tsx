"use client";

import { useState } from "react";
import Avatar from "../shared/Avatar";
import CommentLikeButton from "./CommentLikeButton";
import ReplyInput from "./ReplyInput";
import LikersModal from "../feed/LikersModal";
import ConfirmModal from "../shared/ConfirmModal";
import { toast } from "react-toastify";
import { toggleLikeComment, replyToComment, fetchCommentLikers, deleteComment, updateComment } from "../../api";
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
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
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

  const handleStartEdit = () => {
    setEditText(comment.text);
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    try {
      const updated = await updateComment(comment.id, editText);
      comment.text = updated.text;
      setEditing(false);
      toast.success("Comment updated.");
    } catch (err) {
      toast.error("Couldn't update the comment. Try again.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
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

  const handleStartReplyEdit = (replyId: string, text: string) => {
    setEditReplyText(text);
    setEditingReplyId(replyId);
  };

  const handleSaveReplyEdit = async (replyId: string) => {
    if (!editReplyText.trim()) return;
    try {
      const updated = await updateComment(replyId, editReplyText);
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, text: updated.text } : r)),
      );
      setEditingReplyId(null);
      toast.success("Reply updated.");
    } catch (err) {
      toast.error("Couldn't update the reply. Try again.");
      console.error(err);
    }
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
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
          {editing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-md p-2 text-sm text-[#2D3748] resize-none focus:border-[#1890FF] focus:ring-0 min-h-[60px]"
                rows={2}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                  className="px-3 py-1 text-xs text-white bg-[#1890FF] hover:bg-blue-600 rounded-md disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs text-[#666666] hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#2D3748] mt-0.5">{comment.text}</p>
          )}
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
            <>
              <button
                onClick={handleStartEdit}
                className="text-xs text-[#C4C4C4] hover:text-[#1890FF]"
                title="Edit comment"
              >
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                </svg>
              </button>
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
            </>
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
                    {editingReplyId === reply.id ? (
                      <div className="mt-1">
                        <textarea
                          value={editReplyText}
                          onChange={(e) => setEditReplyText(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-md p-1.5 text-xs text-[#2D3748] resize-none focus:border-[#1890FF] focus:ring-0 min-h-[40px]"
                          rows={1}
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleSaveReplyEdit(reply.id)}
                            disabled={!editReplyText.trim()}
                            className="px-2 py-0.5 text-xs text-white bg-[#1890FF] hover:bg-blue-600 rounded-md disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelReplyEdit}
                            className="px-2 py-0.5 text-xs text-[#666666] hover:bg-gray-100 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#2D3748] mt-0.5">{reply.text}</p>
                    )}
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
                      <>
                        <button
                          onClick={() => handleStartReplyEdit(reply.id, reply.text)}
                          className="text-xs text-[#C4C4C4] hover:text-[#1890FF]"
                          title="Edit reply"
                        >
                          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                          </svg>
                        </button>
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
                      </>
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
