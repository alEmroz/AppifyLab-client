"use client";

import LoginLayout from "../login/components/LoginLayout";
import RegistrationIllustration from "./components/RegistrationIllustration";
import RegisterCard from "./components/RegisterCard";

export default function RegisterPage() {
  const handleRegister = (data: { email: string; password: string }) => {
    console.log("Register:", data);
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
