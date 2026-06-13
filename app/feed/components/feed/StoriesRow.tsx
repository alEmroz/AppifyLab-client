"use client";

import Image from "next/image";

export default function StoriesRow() {
  return (
    <>
      <div className="hidden md:block mb-4">
        <div className="bg-white rounded-md p-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="relative rounded-md overflow-hidden aspect-[3/4]">
              <Image src="/assets/images/card_ppl1.png" alt="Story" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <button className="w-7 h-7 rounded-full bg-[#1890FF] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                  </svg>
                </button>
                <span className="text-white text-[11px] font-medium">Your Story</span>
              </div>
            </div>
            {[
              { src: "/assets/images/card_ppl2.png", name: "Ryan Roslansky" },
              { src: "/assets/images/card_ppl3.png", name: "Ryan Roslansky" },
              { src: "/assets/images/card_ppl4.png", name: "Ryan Roslansky" },
            ].map((story, i) => (
              <div key={i} className="relative rounded-md overflow-hidden aspect-[3/4]">
                <Image src={story.src} alt={story.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-medium">{story.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden mb-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          <div className="flex-shrink-0 w-20">
            <div className="relative rounded-lg overflow-hidden aspect-[3/4] mb-1">
              <Image src="/assets/images/mobile_story_img.png" alt="Your Story" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <button className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1890FF] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-center text-[#666666] truncate">Your Story</p>
          </div>
          {["mobile_story_img1", "mobile_story_img2", "mobile_story_img1", "mobile_story_img2"].map((img, i) => (
            <div key={i} className="flex-shrink-0 w-20">
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] mb-1">
                <Image src={`/assets/images/${img}.png`} alt="Story" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <p className="text-[11px] text-center text-[#666666] truncate">Ryan...</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
