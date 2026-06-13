"use client";

import { useState } from "react";
import { loginSchema, type LoginData } from "@/lib/schemas";
import PasswordInput from "@/components/PasswordInput";

interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<Record<string, string[]> | null>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (serverErrors[field]) setServerErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const serverErr = await onSubmit(result.data);
    setLoading(false);

    if (serverErr) {
      setServerErrors(serverErr);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        {serverErrors.email?.map((msg, i) => (
          <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
        ))}
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Password</label>
        <PasswordInput
          value={form.password}
          onChange={(v) => handleChange("password", v)}
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        {serverErrors.password?.map((msg, i) => (
          <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
        ))}
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
          disabled={loading}
          className="w-full bg-[#1890FF] text-white text-base font-semibold rounded-md py-3 hover:bg-blue-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login now"}
        </button>
      </div>

      {serverErrors.message && (
        <p className="text-red-500 text-xs text-center mb-4">{serverErrors.message[0]}</p>
      )}
    </form>
  );
}
