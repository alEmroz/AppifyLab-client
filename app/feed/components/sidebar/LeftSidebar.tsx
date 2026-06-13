"use client";

import ExploreNav from "./ExploreNav";
import SuggestedPeople from "./SuggestedPeople";
import Events from "./Events";

export default function LeftSidebar() {
  return (
    <aside className="hidden lg:block h-[calc(100vh-64px)] overflow-auto scrollbar-none">
      <div className="py-4 pr-4">
        <ExploreNav />
        <SuggestedPeople />
        <Events />
      </div>
    </aside>
  );
}
