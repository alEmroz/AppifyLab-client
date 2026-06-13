"use client";

import { useState, useEffect } from "react";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const colors = [
  "#1890FF", "#F5222D", "#FA8C16", "#52C41A",
  "#722ED1", "#13C2C2", "#EB2F96", "#2F54EB",
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : "?";
}

export default function Avatar({ name, size = 40, className = "" }: AvatarProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const initials = getInitials(name);
  const bgColor = colors[hashCode(name) % colors.length];

  if (!hydrated) {
    return (
      <div
        className={`rounded-full flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4, backgroundColor: bgColor }}
      title={name}
    >
      {initials}
    </div>
  );
}
