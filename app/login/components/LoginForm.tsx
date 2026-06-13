"use client";

import { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm text-[#2D3748] cursor-pointer">
          <input
            type="radio"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="accent-[#1890FF]"
          />
          Remember me
        </label>
        <button type="button" className="text-sm text-[#1890FF] hover:underline">
          Forgot password?
        </button>
      </div>

      <div className="mt-10 mb-[60px]">
        <button
          type="submit"
          className="w-full bg-[#1890FF] text-white text-base font-semibold rounded-md py-3 hover:bg-blue-600 transition-colors"
        >
          Login now
        </button>
      </div>
    </form>
  );
}
