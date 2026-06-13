"use client";

import Image from "next/image";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt = "", size = 40, className = "" }: AvatarProps) {
  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size} height={size} className="object-cover w-full h-full" />
    </div>
  );
}
