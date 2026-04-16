/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#735c00',
          50: '#f7f5e6',
          100: '#efeccd',
          200: '#dfd99b',
          300: '#cfc669',
          400: '#e9c349',
          500: '#735c00',
          600: '#5d4900',
          700: '#473600',
          800: '#312400',
          900: '#1a1200',
          'fixed': '#ffe088',
          'fixed-dim': '#e9c349',
          'container': '#d4af37',
          'on-fixed': '#241a00',
          'on-fixed-variant': '#574500',
          'on-container': '#554300',
        },
        gold: {
          400: '#d4af37',
          500: '#b8941f',
          600: '#9a7b17',
        },
        'on-background': '#1a1c1c',
        background: '#f9f9f9',
        'surface-container': '#eeeeee',
        'surface-container-low': '#f3f3f3',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'on-surface-variant': '#4d4635',
        'surface-variant': '#e2e2e2',
        secondary: '#5f5e5e',
        tertiary: '#415ba4',
        error: '#ba1a1a',
      },
      borderRadius: {
        'DEFAULT': '0px',
        'lg': '0px',
        'xl': '0px',
        'full': '9999px',
      },
      fontFamily: {
        'headline': ['Noto Serif', 'Georgia', 'serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
        'label': ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tonal': '0 4px 40px rgba(26, 28, 28, 0.04)',
      },
    },
  },
  plugins: [],
}
