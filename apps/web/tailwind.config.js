/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Neue Haas Grotesk Text Pro'", 'Arial', 'sans-serif'],
      },
      colors: {
        // Semantic colors based on Are.na
        bg: {
          primary: 'var(--bg-primary)',
        },
        fg: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--text-accent)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          card: 'var(--border-card)',
        },
        // Direct color values for convenience
        arena: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#888888',
          green: '#6B8E6B',
          'border-dark': '#333333',
          'border-light': '#444444',
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],    // 12px - labels, metadata
        sm: ['0.875rem', { lineHeight: '1.5' }],   // 14px - body
        base: ['1rem', { lineHeight: '1.5' }],     // 16px - channel titles
        lg: ['1.125rem', { lineHeight: '1.4' }],   // 18px - page titles
      },
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
