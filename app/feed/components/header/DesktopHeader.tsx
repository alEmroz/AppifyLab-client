"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { getUser, clearAuth } from "@/lib/api";
import Avatar from "../shared/Avatar";

export default function DesktopHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLLIElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // proceed with local logout even if server request fails
    }
    clearAuth();
    router.push("/login");
  };

  return (
    <nav className="hidden lg:block bg-white border-b border-gray-200">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/feed">
              <Image src="/assets/images/logo.svg" alt="Buddy Script" width={120} height={30} className="h-8 w-auto" />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                type="search"
                placeholder="input search text"
                className="w-[200px] pl-10 pr-3 py-2 bg-[#F0F2F5] border border-[#E8E8E8] rounded-md text-sm placeholder:text-[#666666] focus:border-[#1890FF]"
              />
            </div>

            <ul className="flex items-center gap-5">
              <li>
                <a href="/feed" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100">
                  <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                    <path fill="#1890FF" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                    <path fill="#fff" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
                  </svg>
                </a>
              </li>
              <li ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 relative"
                >
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path fill="#666" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1890FF] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">6</span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-[360px] bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="text-base font-semibold text-[#212121]">Notifications</h4>
                      <button className="p-1">
                        <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
                          <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                          <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                          <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-center text-sm text-[#666666]">No notifications yet</p>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <a href="/chat" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 relative">
                  <svg width="23" height="22" viewBox="0 0 23 22" fill="none">
                    <path fill="#666" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1890FF] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
                </a>
              </li>
            </ul>

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <Avatar name={user ? `${user.first_name} ${user.last_name}` : "User"} size={36} />
                <span className="text-sm font-medium text-[#212121]">
                  {user ? `${user.first_name} ${user.last_name}` : "User"}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-[240px] bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Avatar name={user ? `${user.first_name} ${user.last_name}` : "User"} size={40} />
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121]">
                        {user ? `${user.first_name} ${user.last_name}` : "User"}
                      </h4>
                      <a href="/profile" className="text-xs text-[#1890FF] hover:underline">View Profile</a>
                    </div>
                  </div>
                  <hr className="border-gray-100 my-1" />
                  <div className="px-2">
                    <a href="/settings" className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]">
                      <span className="flex items-center gap-3">
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
                          <path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17z" />
                        </svg>
                        Settings
                      </span>
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                      </svg>
                    </a>
                    <a href="/help" className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]">
                      <span className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18z" />
                          <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
                        </svg>
                        Help & Support
                      </span>
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                      </svg>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]"
                    >
                      <span className="flex items-center gap-3">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                          <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                        </svg>
                        Log Out
                      </span>
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
