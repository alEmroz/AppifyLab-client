"use client";

import Image from "next/image";

interface OAuthDividerProps {
  buttonText?: string;
}

export default function OAuthDivider({ buttonText = "Or sign-in with google" }: OAuthDividerProps) {
  return (
    <>
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-[#F0F2F5] bg-white rounded-md px-[60px] py-3 mb-10"
      >
        <Image src="/assets/images/google.svg" alt="Google" width={20} height={20} className="w-5 h-auto" />
        <span className="text-base font-medium text-[#312000]">{buttonText}</span>
      </button>

      <div className="relative text-center mb-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[108px] h-[2px] bg-[#DFDFDF] rounded" />
        <span className="text-sm text-[#C4C4C4]">Or</span>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[108px] h-[2px] bg-[#DFDFDF] rounded" />
      </div>
    </>
  );
}
