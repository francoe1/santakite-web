/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', 'Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        android: {
          primary: '#0ea5e9',
          secondary: '#10b981',
          surface: '#e9eef5',
          card: '#f8fafc',
          outline: '#cbd5e1',
          onSurface: '#0f172a',
        },
        night: {
          surface: '#0b1220',
          card: '#0f172a',
          outline: '#1f2937',
          onSurface: '#e2e8f0',
        },
      },
      boxShadow: {
        android: '0 8px 28px rgba(0, 0, 0, 0.18)',
        androidSoft: '0 10px 22px rgba(15, 23, 42, 0.18)',
      },
      borderRadius: {
        xl2: '1.4rem',
        xl3: '1.75rem',
      },
    },
  },
  plugins: [],
}
