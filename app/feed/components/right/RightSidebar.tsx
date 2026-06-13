"use client";

import YouMightLike from "./YouMightLike";
import YourFriends from "./YourFriends";

export default function RightSidebar() {
  return (
    <aside className="hidden xl:block h-[calc(100vh-64px)] overflow-auto scrollbar-none">
      <div className="py-4 pl-4">
        <YouMightLike />
        <YourFriends />
      </div>
    </aside>
  );
}
