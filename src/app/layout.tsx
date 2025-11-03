import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopHub - Modern E-commerce Platform",
  description: "A stunning, feature-rich e-commerce platform built with Next.js 15, TypeScript, and modern web technologies.",
  keywords: ["e-commerce", "nextjs", "typescript", "supabase", "react", "tailwind", "framer-motion"],
  authors: [{ name: "ShopHub Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ShopHub - Modern E-commerce",
    description: "Experience the future of online shopping with our modern e-commerce platform",
    url: "https://shophub.vercel.app",
    siteName: "ShopHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Modern E-commerce",
    description: "Experience the future of online shopping",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
