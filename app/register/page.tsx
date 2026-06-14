"use client";

import { useRouter } from "next/navigation";
import api, { setToken, setUser } from "@/lib/api";
import LoginLayout from "../login/components/LoginLayout";
import RegistrationIllustration from "./components/RegistrationIllustration";
import RegisterCard from "./components/RegisterCard";
import type { RegisterData } from "@/lib/schemas";
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

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterData): Promise<Record<string, string[]> | null> => {
    try {
      const response = await api.post<AuthResponse>("/register", data);
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
          <RegistrationIllustration />
        </div>
        <div className="w-full lg:w-5/12">
          <RegisterCard onRegister={handleRegister} />
        </div>
      </div>
    </LoginLayout>
  );
}
