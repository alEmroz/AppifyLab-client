"use client";

import Image from "next/image";
import OAuthDivider from "./OAuthDivider";
import LoginForm from "./LoginForm";

interface LoginCardProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginCard({ onLogin }: LoginCardProps) {
  return (
    <div className="bg-white rounded-md p-12">
      <div className="flex justify-center mb-7">
        <Image src="/assets/images/logo.svg" alt="Buddy Script" width={161} height={40} className="h-10 w-auto" />
      </div>

      <p className="text-center text-[#2D3748] mb-2">Welcome back</p>
      <h4 className="text-center text-[28px] font-medium text-[#212121] mb-[50px]">
        Login to your account
      </h4>

      <OAuthDivider />

      <LoginForm onSubmit={onLogin} />

      <p className="text-center text-sm text-[#2D3748]">
        Dont have an account?{" "}
        <a href="/register" className="text-[#1890FF] hover:underline">
          Create New Account
        </a>
      </p>
    </div>
  );
}
