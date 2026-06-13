"use client";

import EmptyState from "../shared/EmptyState";

export default function Events() {
  return (
    <div className="bg-white rounded-md px-6 py-6 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-semibold text-[#212121]">Events</h4>
        <a href="/events" className="text-sm text-[#1890FF] hover:underline">See all</a>
      </div>
      <EmptyState message="No upcoming events" />
    </div>
  );
}
