/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'britannia-green': '#3B5D44',
        'forge-orange': '#FF7800',
        'off-white': '#F8F8F8',
        'britannia-light': '#60A5FA',
        'britannia-blue': '#3B82F6',
        'britannia-success': '#10B981',
      },
      fontFamily: {
        'serif': ['Merriweather', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
