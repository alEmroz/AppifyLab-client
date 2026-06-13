import Image from "next/image";

export default function RegistrationIllustration() {
  return (
    <div className="hidden lg:block">
      <div className="flex justify-center">
        <Image
          src="/assets/images/registration.png"
          alt="Registration"
          width={633}
          height={500}
          className="w-full max-w-[633px] h-auto"
          priority
        />
      </div>
    </div>
  );
}
