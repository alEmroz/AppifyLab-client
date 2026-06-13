"use client";

import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) return;
    onSubmit({ email, password });
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
          placeholder="Email"
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
          placeholder="Password"
          required
        />
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Repeat Password</label>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Repeat password"
          required
        />
      </div>

      {password !== repeatPassword && repeatPassword && (
        <p className="text-red-500 text-xs mb-2">Passwords do not match</p>
      )}

      <label className="flex items-center gap-2 text-sm text-[#2D3748] cursor-pointer mb-4">
        <input
          type="radio"
          checked={agreeTerms}
          onChange={() => setAgreeTerms(!agreeTerms)}
          className="accent-[#1890FF]"
        />
        I agree to terms & conditions
      </label>

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
