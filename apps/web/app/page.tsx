import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main id="main" className="flex-1">
        <section className="py-24 px-4">
          <div className="max-w-content mx-auto text-center">
            <h1 className="text-3xl font-medium mb-4">
              Your ideas, connected.
            </h1>
            <p className="text-md opacity-70 max-w-md mx-auto mb-8">
              Open-source, self-hostable platform for building mixed-media moodboards. 
              Own your data. Connect your thoughts.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/explore"
                className="px-6 py-2 text-sm border border-black bg-black text-white hover:opacity-70 transition-opacity"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/boerd/boerd"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-sm border border-black hover:opacity-70 transition-opacity"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 border-t border-black">
          <div className="max-w-content mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Feature
                title="Own Your Data"
                description="SQLite + filesystem. Export anytime. No lock-in."
              />
              <Feature
                title="Connect Ideas"
                description="Blocks exist in multiple boerds. Ideas accumulate context."
              />
              <Feature
                title="Embed Anywhere"
                description="Drop your boerds into any website with one line of code."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="h-14 border-b border-black">
      <div className="max-w-content mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-medium">
          boerd
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-sm">
            Explore
          </Link>
          <input
            type="search"
            placeholder="Search"
            className="w-40 h-8 px-3 text-sm border border-black bg-white"
          />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="h-12 border-t border-black">
      <div className="max-w-content mx-auto h-full px-4 flex items-center justify-between">
        <nav className="flex items-center gap-6 text-xs opacity-70">
          <Link href="/about">About</Link>
          <a href="https://github.com/boerd/boerd" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
        <p className="text-xs opacity-50">Open source</p>
      </div>
    </footer>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <p className="text-sm opacity-70">{description}</p>
    </div>
  );
}
