import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "About",
  description:
    "Learn about Boerd - open-source, self-hostable moodboard platform",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <article className="prose prose-invert max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">About</h1>

          <p className="text-lg text-zinc-300 mb-6">
            Boerd is an open-source, self-hostable platform for building
            mixed-media moodboards. Create boerds (collections) of
            blocks—images, text, links, embeds—and organize your ideas,
            inspiration, and projects.
          </p>

          <p className="text-lg text-zinc-300 mb-6">
            Share your boerds publicly or keep them private. Connect ideas
            across channels and collaborate with friends or colleagues.
          </p>

          <div className="grid grid-cols-2 gap-12 my-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Mission</h2>
              <p className="text-base text-zinc-400">
                Provide an Are.na-like experience: a mindful space for long-term
                projects, idea structuring, and collaborative
                knowledge-building. Free from ads, free from algorithms, focused
                on content and creativity.
              </p>
              <p className="text-base text-zinc-400">
                Connect like-minded people: students, hobbyists, and "connected
                knowledge collectors" building their libraries of references.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <ul className="space-y-3 text-base text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Zero-form input: paste, drop, or type. No forms, no
                    dropdowns.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Auto-detection: URLs become links/embeds, images get
                    thumbnails.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Masonry layout: Natural aspect ratios, flowing columns.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Self-hostable: Deploy anywhere—GitHub Pages, Railway,
                    Fly.io, Cloudflare.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Activity feed: See connections grouped into readable
                    sentences.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Privacy-first: Your data stays on your server.</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
