import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Social media application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/images/logo-copy.svg" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
