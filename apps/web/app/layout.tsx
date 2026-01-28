import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "boerd",
    template: "%s — boerd",
  },
  description:
    "Open-source, self-hostable platform for building mixed-media moodboards",
};

import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
