import api from "@/lib/api";

export interface ApiUser {
  uuid: string;
  first_name: string;
  last_name: string;
}

export interface ApiMedia {
  uuid: string;
  url: string;
  sort_order: number;
}

export interface ApiPost {
  uuid: string;
  text: string;
  visibility: string;
  user: ApiUser;
  media: ApiMedia | null;
  created_at: string;
  comments_count: number;
  likes_count: number;
  is_liked: boolean;
}

export interface ApiComment {
  uuid: string;
  user: ApiUser;
  text: string;
  created_at: string;
  replies: ApiComment[];
  likes_count: number;
  is_liked: boolean;
}

export interface Post {
  id: string;
  author: string;
  time: string;
  visibility: "public" | "private";
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  commentsCount: number;
  isOwner: boolean;
  userUuid: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
  userUuid: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
}

export function toComment(c: ApiComment): Comment {
  return {
    id: c.uuid,
    author: `${c.user.first_name} ${c.user.last_name}`,
    text: c.text,
    time: timeAgo(c.created_at),
    likes: c.likes_count,
    liked: c.is_liked,
    replies: (c.replies || []).map(toComment),
    userUuid: c.user.uuid,
  };
}

export function toPost(p: ApiPost): Post {
  return {
    id: p.uuid,
    author: `${p.user.first_name} ${p.user.last_name}`,
    time: timeAgo(p.created_at),
    visibility: p.visibility as "public" | "private",
    text: p.text,
    image: p.media?.url || undefined,
    likes: p.likes_count,
    liked: p.is_liked,
    comments: [],
    commentsCount: p.comments_count,
    isOwner: false,
    userUuid: p.user.uuid,
  };
}

export async function fetchPosts(cursor?: string) {
  const params = cursor ? { cursor } : {};
  const res = await api.get("/posts", { params });
  const apiPosts: ApiPost[] = res.data.data;
  return {
    posts: apiPosts.map(toPost),
    nextCursor: (res.data.meta?.next_cursor as string | null) ?? null,
    prevCursor: (res.data.meta?.prev_cursor as string | null) ?? null,
  };
}

export async function createPost(text: string, visibility: string, image?: File) {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("visibility", visibility);
  if (image) formData.append("image", image);
  const res = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return toPost(res.data);
}

export async function updatePost(uuid: string, text: string, visibility: string, image?: File) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("text", text);
  formData.append("visibility", visibility);
  if (image) formData.append("image", image);
  const res = await api.post(`/posts/${uuid}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return toPost(res.data);
}

export async function deletePost(uuid: string) {
  await api.delete(`/posts/${uuid}`);
}

export async function toggleLikePost(uuid: string) {
  const res = await api.post(`/posts/${uuid}/like`);
  return res.data as { is_liked: boolean; likes_count: number };
}

export async function fetchLikers(uuid: string, cursor?: string) {
  const params = cursor ? { cursor } : {};
  const res = await api.get(`/posts/${uuid}/likes`, { params });
  const users = res.data.data || [];
  return {
    users: users.map((u: ApiUser) => ({ name: `${u.first_name} ${u.last_name}` })),
    nextCursor: (res.data.meta?.next_cursor as string | null) ?? null,
  };
}

export async function fetchComments(postUuid: string, cursor?: string) {
  const params = cursor ? { cursor } : {};
  const res = await api.get(`/posts/${postUuid}/comments`, { params });
  const comments = (res?.data?.data || []);
  return {
    comments: comments.map(toComment),
    nextCursor: (res.data.meta?.next_cursor as string | null) ?? null,
  };
}

export async function addComment(postUuid: string, text: string) {
  const res = await api.post(`/posts/${postUuid}/comments`, { text });
  return toComment(res.data);
}

export async function replyToComment(commentUuid: string, text: string) {
  const res = await api.post(`/comments/${commentUuid}/reply`, { text });
  return toComment(res.data);
}

export async function toggleLikeComment(uuid: string) {
  const res = await api.post(`/comments/${uuid}/like`);
  return res.data as { is_liked: boolean; likes_count: number };
}

export async function fetchCommentLikers(uuid: string, cursor?: string) {
  const params = cursor ? { cursor } : {};
  const res = await api.get(`/comments/${uuid}/likes`, { params });
  const users = res.data.data || [];
  return {
    users: users.map((u: ApiUser) => ({ name: `${u.first_name} ${u.last_name}` })),
    nextCursor: (res.data.meta?.next_cursor as string | null) ?? null,
  };
}

export async function deleteComment(uuid: string) {
  await api.delete(`/comments/${uuid}`);
}
