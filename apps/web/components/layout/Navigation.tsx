import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationProps {
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Navigation - Breadcrumb navigation
 */
export function Navigation({ breadcrumbs = [] }: NavigationProps) {
  return (
    <nav className="flex items-center gap-2 text-sm py-4">
      <Link href="/" className="text-white hover:opacity-70 transition-opacity">
        boerd
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="text-zinc-500">/</span>
          {crumb.href ? (
            <Link href={crumb.href} className="text-[#6B8E6B] hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-white">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

interface ViewOptionsProps {
  view: string;
  onViewChange: (view: string) => void;
  options?: string[];
}

/**
 * ViewOptions - Radio-style view selector
 */
export function ViewOptions({ view, onViewChange, options = ['All', 'Channels', 'Blocks'] }: ViewOptionsProps) {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-2">View</p>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onViewChange(option)}
          className={`block text-sm ${view === option ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          {view === option ? '● ' : '  '}{option}
        </button>
      ))}
    </div>
  );
}

interface SortOptionsProps {
  sort: string;
  onSortChange: (sort: string) => void;
  options?: string[];
}

/**
 * SortOptions - Radio-style sort selector
 */
export function SortOptions({ sort, onSortChange, options = ['Recently updated', 'Random'] }: SortOptionsProps) {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-2">Sort</p>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSortChange(option)}
          className={`block text-sm ${sort === option ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          {sort === option ? '● ' : '  '}{option}
        </button>
      ))}
    </div>
  );
}
