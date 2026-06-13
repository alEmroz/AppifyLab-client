"use client";

import LoginLayout from "./components/LoginLayout";
import LoginIllustration from "./components/LoginIllustration";
import LoginCard from "./components/LoginCard";

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password });
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
