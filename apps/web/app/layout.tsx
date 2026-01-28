import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'boerd',
    template: '%s — boerd',
  },
  description: 'Open-source, self-hostable platform for building mixed-media moodboards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body className="bg-black text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:border focus:border-black focus:bg-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
