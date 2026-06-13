"use client";

import Image from "next/image";

export default function MobileHeader() {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/feed">
            <Image src="/assets/images/logo.svg" alt="Buddy Script" width={100} height={25} className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <a href="/search" className="p-2">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
