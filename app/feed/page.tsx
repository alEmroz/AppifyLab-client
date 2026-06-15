"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getUser } from "@/lib/api";
import FeedLayout from "./components/FeedLayout";
import StoriesRow from "./components/feed/StoriesRow";
import CreatePost from "./components/feed/CreatePost";
import PostCard from "./components/feed/PostCard";
import { toast } from "react-toastify";
import { fetchPosts, createPost, deletePost, Post as PostType } from "./api";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const currentUser = getUser();
  const sentinelRef = useRef<HTMLDivElement>(null);

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
        setNextCursor(result.nextCursor);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.uuid]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const result = await fetchPosts(nextCursor);
      const userUuid = currentUser?.uuid;
      setPosts((prev) => [
        ...prev,
        ...result.posts.map((p) => ({
          ...p,
          isOwner: p.userUuid === userUuid,
        })),
      ]);
      setNextCursor(result.nextCursor);
    } catch (err) {
      toast.error("Couldn't load more posts. Try again.");
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore, currentUser?.uuid]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleCreatePost = async (
    text: string,
    image: File | null,
    visibility: "public" | "private"
  ) => {
    try {
      const newPost = await createPost(text, visibility, image || undefined);
      setPosts([{ ...newPost, isOwner: true }, ...posts]);
    } catch (err) {
      toast.error("Couldn't create your post. Please try again.");
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      toast.success("Post deleted successfully.");
    } catch (err) {
      toast.error("Couldn't delete the post. Please try again.");
      console.error(err);
    }
  };

  const handleEditPost = (postId: string, updated: PostType) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated, isOwner: true } : p)));
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
        <PostCard key={post.id} post={post} onDeletePost={handleDeletePost} onEditPost={handleEditPost} />
      ))}
      {loadingMore && (
        <div className="text-center py-4 text-sm text-[#666666]">Loading more...</div>
      )}
      <div ref={sentinelRef} className="h-1" />
    </FeedLayout>
  );
}
