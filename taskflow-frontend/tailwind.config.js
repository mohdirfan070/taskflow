/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    // Chakra UI ships its own CSS reset (applied via ChakraProvider).
    // Disabling Tailwind's preflight avoids the two resets fighting over
    // base element styles (headings, buttons, form elements, etc).
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFFCFA',
          100: '#CFF7F1',
          300: '#5FC9BE',
          500: '#0F766E',
          600: '#0C5F58',
          700: '#0A4B45',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
