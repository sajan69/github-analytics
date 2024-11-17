/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vercel-dark': '#000',
        'vercel-dark-accent': '#111',
        'vercel-dark-text': '#fff',
        'vercel-dark-text-secondary': '#888',
        'vercel-light': '#fff',
        'vercel-light-accent': '#fafafa',
        'vercel-light-text': '#000',
        'vercel-light-text-secondary': '#666',
        'bg-vercel-dark': '#000',
        'bg-vercel-light': '#fff',
        'shadow-dark': '#000',
      },
    },
  },
  plugins: [],
}