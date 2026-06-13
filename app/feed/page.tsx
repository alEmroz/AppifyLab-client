"use client";

import { useState } from "react";
import FeedLayout from "./components/FeedLayout";
import StoriesRow from "./components/feed/StoriesRow";
import CreatePost from "./components/feed/CreatePost";
import PostCard from "./components/feed/PostCard";

interface Reply {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
  replies?: Reply[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  visibility: "public" | "private";
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  isOwner: boolean;
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Dylan Field",
    avatar: "/assets/images/post_img.png",
    time: "5 minute ago",
    visibility: "public",
    text: "-Healthy Tracking App",
    image: "/assets/images/timeline_img.png",
    likes: 9,
    liked: true,
    isOwner: true,
    comments: [
      {
        id: "c1",
        author: "Radovan SkillArena",
        avatar: "/assets/images/txt_img.png",
        text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        likes: 198,
        liked: false,
        time: ".21m",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: "Karim Saif",
    avatar: "/assets/images/post_img.png",
    time: "10 minute ago",
    visibility: "public",
    text: "Beautiful sunset at the beach today!",
    image: "/assets/images/img10.png",
    likes: 24,
    liked: false,
    isOwner: false,
    comments: [],
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleCreatePost = (text: string, image: File | null, visibility: "public" | "private") => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: "Dylan Field",
      avatar: "/assets/images/profile.png",
      time: "just now",
      visibility,
      text,
      image: image ? URL.createObjectURL(image) : undefined,
      likes: 0,
      liked: false,
      comments: [],
      isOwner: true,
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <FeedLayout>
      <StoriesRow />
      <CreatePost onPost={handleCreatePost} />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </FeedLayout>
  );
}
