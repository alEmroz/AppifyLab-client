"use client";

import DesktopHeader from "./header/DesktopHeader";
import MobileHeader from "./header/MobileHeader";
import MobileBottomNav from "./header/MobileBottomNav";
import LeftSidebar from "./sidebar/LeftSidebar";
import RightSidebar from "./right/RightSidebar";

interface FeedLayoutProps {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5]">
      <DesktopHeader />
      <MobileHeader />

      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_6fr_3fr] xl:grid-cols-[3fr_6fr_3fr] gap-0 h-full">
            <LeftSidebar />
            <main className="h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] overflow-auto scrollbar-none pt-4 pb-24 lg:pb-4">
              {children}
            </main>
            <RightSidebar />
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
