"use client";

import EmptyState from "../shared/EmptyState";

export default function SuggestedPeople() {
  return (
    <div className="bg-white rounded-md px-6 py-6 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-semibold text-[#212121]">Suggested People</h4>
        <a href="#0" className="text-sm text-[#1890FF] hover:underline">See All</a>
      </div>
      <EmptyState message="No suggestions available" />
    </div>
  );
}
