"use client";

import { useState } from "react";
import { registerSchema, type RegisterData } from "@/lib/schemas";
import PasswordInput from "@/components/PasswordInput";

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<Record<string, string[]> | null>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (serverErrors[field]) setServerErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (form.password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
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
        <label className="block text-base font-medium text-[#4A5568] mb-2">First Name</label>
        <input
          type="text"
          value={form.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="First name"
        />
        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
        {serverErrors.first_name?.map((msg, i) => (
          <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
        ))}
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Last Name</label>
        <input
          type="text"
          value={form.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Last name"
        />
        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
        {serverErrors.last_name?.map((msg, i) => (
          <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
        ))}
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full bg-white border border-[#E8E8E8] rounded-md px-4 py-3 text-[#2D3748] focus:border-[#1890FF] focus:ring-0 h-12"
          placeholder="Email"
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
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        {serverErrors.password?.map((msg, i) => (
          <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
        ))}
      </div>
      <div className="mb-3.5">
        <label className="block text-base font-medium text-[#4A5568] mb-2">Confirm Password</label>
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

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
          disabled={loading}
          className="w-full bg-[#1890FF] text-white text-base font-semibold rounded-md py-3 hover:bg-blue-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register now"}
        </button>
      </div>

      {serverErrors.message && (
        <p className="text-red-500 text-xs text-center mb-4">{serverErrors.message[0]}</p>
      )}
    </form>
  );
}
