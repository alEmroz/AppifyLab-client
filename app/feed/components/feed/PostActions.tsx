"use client";

import { useState } from "react";
import LikeButton from "./LikeButton";
import WhoLikedModal from "./WhoLikedModal";

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
}

export default function PostActions({ postId, likesCount, commentsCount, liked: initialLiked }: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likesCount);
  const [showLikes, setShowLikes] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
  };

  return (
    <>
      <div className="px-6 pb-3 flex items-center justify-between text-sm text-[#666666]">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <img src="/assets/images/react_img1.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1 first:ml-0" />
            <img src="/assets/images/react_img2.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1" />
            <img src="/assets/images/react_img3.png" alt="" className="w-5 h-5 rounded-full border-2 border-white -ml-1 hidden md:block" />
          </div>
          <button onClick={() => setShowLikes(true)} className="ml-1 hover:text-[#1890FF]">
            {count}+
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:text-[#1890FF] cursor-pointer">{commentsCount} Comment</span>
          <span className="hover:text-[#1890FF] cursor-pointer">122 Share</span>
        </div>
      </div>

      <hr className="border-gray-100 mx-6" />

      <div className="px-6 py-2 flex items-center justify-between">
        <LikeButton liked={liked} count={count} onToggle={handleLike} />
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#666666] hover:bg-gray-100">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
          </svg>
          Comment
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#666666] hover:bg-gray-100">
          <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
            <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
          </svg>
          Share
        </button>
      </div>

      <WhoLikedModal open={showLikes} onClose={() => setShowLikes(false)} />
    </>
  );
}
