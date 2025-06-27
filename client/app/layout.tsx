import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/providers/notification-provider";
import Script from "next/script"; // 👈 import Next.js Script component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindGuard - AI-Powered Mental Health Platform",
  description:
    "Early detection and support for mental health with AI-powered analysis",
  manifest: "/manifest.json",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Recommended place for global scripts */}
        <Script
          src="https://cdn.botpress.cloud/webchat/v3.0/inject.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://files.bpcontent.cloud/2025/06/27/18/20250627181427-0P136J5L.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
