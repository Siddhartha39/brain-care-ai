/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#dcf1ff',
          500: '#1d6ef2',
          600: '#1759d0',
          700: '#1044a5',
        },
        navy: '#0f172a',
        medical: '#e6f7ff',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
