"use client";

import { useState, useEffect } from "react";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
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
      style={{ width: size, height: size, fontSize: size * 0.4, backgroundColor: "#1890FF" }}
      title={name}
    >
      {initials}
    </div>
  );
}
