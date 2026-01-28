import Link from 'next/link';

interface HeaderProps {
  currentPath?: string;
}

/**
 * Header - Site header with navigation
 * Dark theme styling per UI Design Guide
 */
export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="h-12 border-b border-zinc-800 bg-black">
      <div className="max-w-content mx-auto h-full px-4 sm:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-medium hover:opacity-70 transition-opacity">
          boerd
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          <NavLink href="/feed" current={currentPath === '/feed'}>Feed</NavLink>
          <Separator />
          <NavLink href="/explore" current={currentPath === '/explore'}>Explore</NavLink>
          <Separator />
          <NavLink href="/me" current={currentPath?.startsWith('/me')}>Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, current, children }: { href: string; current?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`
        transition-colors
        ${current ? 'text-white font-semibold' : 'text-zinc-500 hover:text-white'}
      `}
    >
      {children}
    </Link>
  );
}

function Separator() {
  return <span className="text-zinc-600">·</span>;
}
