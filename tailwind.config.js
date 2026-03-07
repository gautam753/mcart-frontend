/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF3F6C',
        'primary-dark': '#E8174C',
        dark: '#1C1C1C',
        muted: '#696B79',
        surface: '#F5F5F6',
        border: '#D4D5D9',
      },
      fontFamily: {
        sans: ['Assistant', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.1)',
        nav: '0 2px 4px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

