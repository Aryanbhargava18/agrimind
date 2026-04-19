/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './web/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: 'var(--color-forest)',
        lime: 'var(--color-lime)',
        cream: 'var(--color-cream)',
        charcoal: 'var(--color-charcoal)',
      },
      fontFamily: {
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 46px rgba(170, 255, 69, 0.28)',
        glass: '0 24px 80px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

