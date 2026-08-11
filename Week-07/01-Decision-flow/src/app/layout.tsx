import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Decision Flow",
  description: "Visual AI Workflow Engine",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} antialiased min-h-screen bg-[#0a0a0f] text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
