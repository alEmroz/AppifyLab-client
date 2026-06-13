"use client";

import { useState, useRef, useEffect } from "react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface ThreeDotMenuProps {
  items: MenuItem[];
}

export default function ThreeDotMenu({ items }: ThreeDotMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
          <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
          <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
          <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-100 z-50 min-w-[180px] py-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${
                item.danger ? "text-red-500" : "text-[#212121]"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
