"use client";

import { useRouter } from "next/navigation";
import api, { setToken, setUser } from "@/lib/api";
import LoginLayout from "./components/LoginLayout";
import LoginIllustration from "./components/LoginIllustration";
import LoginCard from "./components/LoginCard";
import type { LoginData } from "@/lib/schemas";
import type { AxiosError } from "axios";

interface AuthResponse {
  token: string;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginData): Promise<Record<string, string[]> | null> => {
    try {
      const response = await api.post<AuthResponse>("/login", data);
      setToken(response.data.token);
      setUser(response.data.user);
      router.push("/feed");
      return null;
    } catch (err) {
      const error = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
      if (error.response?.status === 422) {
        return error.response.data.errors ?? { message: [error.response.data.message] };
      }
      return { message: ["Something went wrong. Please try again."] };
    }
  };

  return (
    <LoginLayout>
      <div className="flex items-center flex-col lg:flex-row lg:gap-6">
        <div className="w-full lg:w-7/12">
          <LoginIllustration />
        </div>
        <div className="w-full lg:w-5/12">
          <LoginCard onLogin={handleLogin} />
        </div>
      </div>
    </LoginLayout>
  );
}
