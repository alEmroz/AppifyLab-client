"use client";

import Image from "next/image";
import OAuthDivider from "../../login/components/OAuthDivider";
import RegisterForm from "./RegisterForm";
import type { RegisterData } from "@/lib/schemas";

interface RegisterCardProps {
  onRegister: (data: RegisterData) => Promise<Record<string, string[]> | null>;
}

export default function RegisterCard({ onRegister }: RegisterCardProps) {
  return (
    <div className="bg-white rounded-md p-12">
      <div className="flex justify-center mb-7">
        <Image src="/assets/images/logo.svg" alt="Buddy Script" width={161} height={40} className="h-10 w-auto" />
      </div>

      <p className="text-center text-[#2D3748] mb-2">Get Started Now</p>
      <h4 className="text-center text-[28px] font-medium text-[#212121] mb-[50px]">
        Registration
      </h4>

      <OAuthDivider buttonText="Register with google" />

      <RegisterForm onSubmit={onRegister} />

      <p className="text-center text-sm text-[#2D3748]">
        Dont have an account?{" "}
        <a href="/login" className="text-[#1890FF] hover:underline">
          Create New Account
        </a>
      </p>
    </div>
  );
}
