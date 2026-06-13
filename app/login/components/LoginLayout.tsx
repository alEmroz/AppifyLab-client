import DecorativeShapes from "./DecorativeShapes";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <section className="min-h-screen flex items-center py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F0F2F5]" />
      <DecorativeShapes />
      <div className="w-full relative z-10">
        <div className="max-w-[1140px] mx-auto px-4">
          {children}
        </div>
      </div>
    </section>
  );
}
