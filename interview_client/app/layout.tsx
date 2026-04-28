/**
 * @file layout.tsx (interview_client)
 * @description Root layout for the candidate-facing AI interview app.
 *
 * This is a separate Next.js app from the HR dashboard. It uses Tailwind CSS
 * and has no AuthProvider (candidates authenticate via URL tokenId only).
 * Sets SEO metadata and applies full-height body styling.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireMintora Interview",
  description: "AI-powered interview platform by HireMintora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f9fafb] antialiased">
        {children}
      </body>
    </html>
  );
}
