import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

interface HeaderProps {
  currentPath?: string;
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        theme === "dark"
          ? current
            ? "text-white font-semibold"
            : "text-zinc-400 hover:text-white"
          : current
            ? "text-black font-semibold"
            : "text-gray-400 hover:text-gray-200",
      )}
    >
      {children}
    </Link>
  );
}

function Separator() {
  const { theme } = useTheme();

  return (
    <span className={theme === "dark" ? "text-zinc-600" : "text-gray-400"}>
      {" "}
    </span>
  );
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="h-12 border-b border-zinc-800 bg-black">
      <div className="max-w-content mx-auto h-full px-4 sm:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-medium hover:opacity-70 transition-opacity"
        >
          boerd
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          <NavLink href="/feed" current={currentPath === "/feed"}>
            Feed
          </NavLink>
          <Separator />
          <NavLink href="/explore" current={currentPath === "/explore"}>
            Explore
          </NavLink>
          <Separator />
          <NavLink href="/me" current={currentPath?.startsWith("/me")}>
            Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
