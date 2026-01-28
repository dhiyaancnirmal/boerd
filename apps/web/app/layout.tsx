"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const metadata = {
  title: "Home",
  description: "Boerd - open-source, self-hostable moodboard platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <html lang="en" suppressHydrationWarning data-theme={theme}>
      <body className="bg-black text-white antialiased">
        <ThemeProvider>
          <Header />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
