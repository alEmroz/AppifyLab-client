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
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#112032] rounded-t-[25.5px] px-2 pb-2 pt-7">
                <button className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1890FF] border-2 border-[#112032] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                  </svg>
                </button>
                <p className="text-white text-[12px] font-medium text-center">Your Story</p>
              </div>
            </div>
            {[
              { src: "/assets/images/card_ppl2.png", name: "Ryan Roslansky", avatar: "/assets/images/mini_pic.png" },
              { src: "/assets/images/card_ppl3.png", name: "Ryan Roslansky", avatar: "/assets/images/mini_pic.png" },
              { src: "/assets/images/card_ppl4.png", name: "Ryan Roslansky", avatar: "/assets/images/mini_pic.png" },
            ].map((story, i) => (
              <div key={i} className="relative rounded-md overflow-hidden aspect-[3/4]">
                <Image src={story.src} alt={story.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-0 left-0 right-0 z-10 pb-3">
                  <p className="text-white text-xs font-medium text-center">{story.name}</p>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <Image src={story.avatar} alt="" width={28} height={28} className="rounded-full border-2 border-white" />
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
              <div className="absolute inset-0 bg-black/50" />
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
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute top-1.5 right-1.5 z-10">
                  <Image src="/assets/images/mini_pic.png" alt="" width={20} height={20} className="rounded-full border-2 border-white" />
                </div>
              </div>
              <p className="text-[11px] text-center text-[#666666] truncate">Ryan...</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
