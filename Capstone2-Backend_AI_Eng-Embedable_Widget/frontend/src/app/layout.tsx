import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeadForge — AI-Powered Lead Capture Platform",
    template: "%s | LeadForge",
  },
  description:
    "Deploy intelligent AI widgets that engage visitors, qualify leads, and capture valuable business insights in real-time. The future of lead generation is here.",
  keywords: [
    "AI widget",
    "lead capture",
    "chatbot",
    "lead qualification",
    "LeadForge",
    "FlyRank",
    "AI sales",
    "conversion optimization",
  ],
  authors: [{ name: "Mussarat Shamsher" }],
  openGraph: {
    title: "LeadForge — AI-Powered Lead Capture",
    description: "Turn visitors into qualified leads with intelligent AI widgets.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadForge — AI-Powered Lead Capture",
    description: "Turn visitors into qualified leads with intelligent AI widgets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
