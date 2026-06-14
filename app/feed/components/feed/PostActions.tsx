"use client";

import { useState } from "react";
import LikersModal from "./LikersModal";
import { toggleLikePost, fetchLikers } from "../../api";

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onCommentClick?: () => void;
}

export default function PostActions({ postId, likesCount, commentsCount, liked: initialLiked, onCommentClick }: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likesCount);
  const [showLikes, setShowLikes] = useState(false);
  const [likersList, setLikersList] = useState<{ name: string }[]>([]);
  const [likersCursor, setLikersCursor] = useState<string | null>(null);
  const [loadingLikers, setLoadingLikers] = useState(false);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    try {
      const result = await toggleLikePost(postId);
      setLiked(result.is_liked);
      setCount(result.likes_count);
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    }
  };

  const handleShowLikes = async () => {
    setLoadingLikers(true);
    try {
      const result = await fetchLikers(postId);
      setLikersList(result.users);
      setLikersCursor(result.nextCursor);
    } catch {
      setLikersList([]);
    } finally {
      setLoadingLikers(false);
    }
    setShowLikes(true);
  };

  const handleLoadMoreLikers = async () => {
    if (!likersCursor || loadingLikers) return;
    setLoadingLikers(true);
    try {
      const result = await fetchLikers(postId, likersCursor);
      setLikersList((prev) => [...prev, ...result.users]);
      setLikersCursor(result.nextCursor);
    } catch {
      // silently fail
    } finally {
      setLoadingLikers(false);
    }
  };

  return (
    <>
      <div className="px-6 pb-3 flex items-center justify-between text-sm">
        <div className="flex items-center" onClick={handleShowLikes}>
          <div className="flex items-center cursor-pointer">
            <img src="/assets/images/react_img1.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1 first:ml-0" />
            <img src="/assets/images/react_img2.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1" />
            <img src="/assets/images/react_img3.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1" />
            <img src="/assets/images/react_img4.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1 hidden md:block" />
            <img src="/assets/images/react_img5.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1 hidden md:block" />
            <span className="w-5 h-5 rounded-full border-2 border-white bg-[#1890FF] text-white text-[10px] font-medium flex items-center justify-center -ml-1">{count}+</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[rgba(0,0,0,0.46)] hover:text-[#1890FF] cursor-pointer text-sm">
            <span className="text-[#212121] font-medium">{commentsCount}</span> Comment{commentsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="bg-[#FBFCFD] flex items-center px-2 py-2">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center h-12 rounded-md text-sm transition-colors ${
            liked ? "bg-[#e4f1fd]" : "hover:bg-[#e4f1fd]"
          }`}
        >
          <span className="flex items-center gap-2 text-[#000000]">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
              <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
              <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
              <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
            </svg>
            Haha
          </span>
        </button>
        <button
          onClick={onCommentClick}
          className="flex-1 flex items-center justify-center h-12 rounded-md text-sm hover:bg-[#e4f1fd] transition-colors"
        >
          <span className="flex items-center gap-2 text-[#000000]">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
            </svg>
            Comment
          </span>
        </button>
        <button className="flex-1 flex items-center justify-center h-12 rounded-md text-sm hover:bg-[#e4f1fd] transition-colors">
          <span className="flex items-center gap-2 text-[#000000]">
            <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
              <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
            </svg>
            Share
          </span>
        </button>
      </div>

      <LikersModal
        open={showLikes}
        onClose={() => setShowLikes(false)}
        users={likersList}
        hasMore={!!likersCursor}
        loadingMore={loadingLikers}
        onLoadMore={handleLoadMoreLikers}
      />
    </>
  );
}