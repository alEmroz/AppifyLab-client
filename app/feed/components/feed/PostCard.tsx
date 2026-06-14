"use client";

import { useRef, useState } from "react";
import ThreeDotMenu from "../shared/ThreeDotMenu";
import Avatar from "../shared/Avatar";
import PostActions from "./PostActions";
import CommentSection from "../comments/CommentSection";
import ConfirmModal from "../shared/ConfirmModal";
import EditPostModal from "./EditPostModal";
import type { Post } from "../../api";

interface PostCardProps {
  post: Post;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (postId: string, updatedPost: Post) => void;
}

export default function PostCard({ post, onDeletePost, onEditPost }: PostCardProps) {
  const [commentCount, setCommentCount] = useState(post.commentsCount);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommentClick = () => {
    inputRef.current?.focus();
  };

  const handleCommentAdded = () => {
    setCommentCount((prev) => prev + 1);
  };

  const menuItems = post.isOwner
    ? [
        { label: "Edit Post", icon: <EditIcon />, onClick: () => setShowEditModal(true) },
        { label: "Delete Post", icon: <DeleteIcon />, onClick: () => setShowDeleteConfirm(true), danger: true },
      ]
    : [
        { label: "Hide", icon: <HideIcon />, onClick: () => {} },
      ];

  return (
    <div className="bg-white rounded-md mb-4 overflow-hidden">
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={post.author} size={44} />
            <div>
              <h4 className="text-sm font-semibold text-[#212121]">{post.author}</h4>
              <p className="text-xs text-[#666666]">
                {post.time} .{" "}
                <span className={post.visibility === "private" ? "text-amber-500" : "text-[#0ACF83]"}>
                  {post.visibility === "public" ? "Public" : "Private"}
                </span>
              </p>
            </div>
          </div>
          <ThreeDotMenu items={menuItems} />
        </div>

        <p className="text-sm text-[#2D3748] mt-4">{post.text}</p>

        {post.image && (
          <div className="mt-4 -mx-6">
            <img src={post.image} alt="" className="w-full max-h-[500px] object-cover" />
          </div>
        )}
      </div>

      <PostActions
        postId={post.id}
        likesCount={post.likes}
        commentsCount={commentCount}
        liked={post.liked}
        onCommentClick={handleCommentClick}
      />

      <CommentSection
        postUuid={post.id}
        inputRef={inputRef}
        onCommentAdded={handleCommentAdded}
        onDeleteComment={() => setCommentCount((prev) => Math.max(0, prev - 1))}
      />

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete post?"
        message="This will also delete all comments and replies."
        onConfirm={() => { onDeletePost?.(post.id); setShowDeleteConfirm(false); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <EditPostModal
        open={showEditModal}
        postId={post.id}
        initialText={post.text}
        initialVisibility={post.visibility}
        initialImage={post.image}
        onClose={() => setShowEditModal(false)}
        onSaved={(updated) => onEditPost?.(post.id, updated)}
      />
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
      <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
    </svg>
  );
}