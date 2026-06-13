"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/api";
import FeedLayout from "./components/FeedLayout";
import StoriesRow from "./components/feed/StoriesRow";
import CreatePost from "./components/feed/CreatePost";
import PostCard from "./components/feed/PostCard";
import { fetchPosts, createPost, deletePost, Post as PostType } from "./api";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getUser();

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchPosts();
        const userUuid = currentUser?.uuid;
        setPosts(
          result.posts.map((p) => ({
            ...p,
            isOwner: p.userUuid === userUuid,
          }))
        );
      } catch {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.uuid]);

  const handleCreatePost = async (
    text: string,
    image: File | null,
    visibility: "public" | "private"
  ) => {
    try {
      const newPost = await createPost(text, visibility, image || undefined);
      setPosts([{ ...newPost, isOwner: true }, ...posts]);
    } catch {
      // silently fail
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch {
      // silently fail
    }
  };

  return (
    <FeedLayout>
      <StoriesRow />
      <CreatePost onPost={handleCreatePost} />
      {loading && (
        <div className="text-center py-8 text-sm text-[#666666]">Loading posts...</div>
      )}
      {error && (
        <div className="text-center py-8 text-sm text-red-500">{error}</div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-8 text-sm text-[#666666]">
          No posts yet. Be the first to share something!
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDeletePost={handleDeletePost} />
      ))}
    </FeedLayout>
  );
}
