"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 w-9 h-9 rounded-full border border-zinc-700 bg-black text-white flex items-center justify-center hover:border-zinc-500 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className="text-sm font-medium">
        {theme === "dark" ? "L" : "D"}
      </span>
    </button>
  );
}
