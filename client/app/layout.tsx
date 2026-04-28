/**
 * @file layout.tsx
 * @description Root layout for the HireMintora HR Dashboard (Next.js App Router).
 *
 * Responsibilities:
 * - Imports the global CSS design system (`globals.css`).
 * - Wraps all pages with <AuthProvider> for global authentication state.
 * - Sets SEO metadata (title + description) for the entire dashboard app.
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "HireMintora — AI-Powered Hiring Platform",
  description:
    "Streamline your recruitment with AI-powered interviews, candidate tracking, and smarter screening.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
