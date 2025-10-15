import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/providers/theme-provider";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { AppRouterCacheProvider } from "@/providers/app-router-cache-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BobyAI Characters",
  description:
    "Character-driven conversational AI experience with rich animations and realtime sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 antialiased`}
      >
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <SupabaseProvider>{children}</SupabaseProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
