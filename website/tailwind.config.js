/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'radial': 'radial-gradient(1000px 600px at 0% 0%, rgba(99,102,241,.15), transparent 60%), radial-gradient(800px 500px at 100% 0%, rgba(236,72,153,.12), transparent 55%), radial-gradient(700px 400px at 50% 100%, rgba(34,197,94,.12), transparent 60%)',
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};