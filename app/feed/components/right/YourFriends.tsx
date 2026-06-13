"use client";

import EmptyState from "../shared/EmptyState";

export default function YourFriends() {
  return (
    <div className="bg-white rounded-md px-6 py-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-[#212121]">Your Friends</h4>
        <a href="#0" className="text-sm text-[#1890FF] hover:underline">See All</a>
      </div>
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 17 17" fill="none">
          <circle cx="7" cy="7" r="6" stroke="#666" />
          <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
        </svg>
        <input
          type="search"
          placeholder="Search"
          className="w-full pl-8 pr-3 py-2 bg-[#F0F2F5] border border-[#E8E8E8] rounded-md text-sm placeholder:text-[#666666]"
        />
      </div>
      <EmptyState message="No friends yet" />
    </div>
  );
}
