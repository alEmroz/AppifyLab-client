"use client";

import { useState } from "react";
import { toast } from "react-toastify";
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      toast.error("Couldn't load likes.");
      console.error(err);
    } finally {
      setLoadingLikers(false);
    }
  };

  return (
    <>
      <div className="px-6 pb-3 flex items-center justify-between text-sm">
        <div className="flex items-center" onClick={handleShowLikes}>
          <div className="flex items-center cursor-pointer">
            <img src="/assets/images/react_img1.png" alt="" className="w-8 h-8 rounded-full border-2 border-white -ml-3 first:ml-0" />
            <img src="/assets/images/react_img2.png" alt="" className="w-8 h-8 rounded-full border-2 border-white -ml-3" />
            <img src="/assets/images/react_img3.png" alt="" className="w-8 h-8 rounded-full border-2 border-white -ml-3" />
            <img src="/assets/images/react_img4.png" alt="" className="w-8 h-8 rounded-full border-2 border-white -ml-3 hidden md:block" />
            <img src="/assets/images/react_img5.png" alt="" className="w-8 h-8 rounded-full border-2 border-white -ml-3 hidden md:block" />
            <span className="w-8 h-8 rounded-full border-2 border-white bg-[#1890FF] text-white text-xs font-medium flex items-center justify-center -ml-3">{count}+</span>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "red" : "none"} stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Like
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