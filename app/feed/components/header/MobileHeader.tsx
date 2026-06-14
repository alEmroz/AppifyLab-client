"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { getUser, clearAuth } from "@/lib/api";
import Avatar from "../shared/Avatar";

export default function MobileHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
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
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <Avatar name={user ? `${user.first_name} ${user.last_name}` : "User"} size={32} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-10 w-[220px] bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Avatar name={user ? `${user.first_name} ${user.last_name}` : "User"} size={36} />
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121]">
                        {user ? `${user.first_name} ${user.last_name}` : "User"}
                      </h4>
                      <a href="/profile" className="text-xs text-[#1890FF] hover:underline">View Profile</a>
                    </div>
                  </div>
                  <hr className="border-gray-100 my-1" />
                  <div className="px-2">
                    <a href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]">
                      <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
                        <path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17z" />
                      </svg>
                      Settings
                    </a>
                    <a href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18z" />
                        <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
                      </svg>
                      Help & Support
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-[#212121]"
                    >
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}