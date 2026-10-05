import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          50: '#f8faf7',
          100: '#f0f4ef',
          200: '#dde6dc',
          300: '#c2d2c0',
          400: '#a1b89e',
          500: '#7f9d7c',
          600: '#62815f',
          700: '#4e674c',
          800: '#40533f',
          900: '#364535',
          950: '#1b251b',
        },
        stone: {
          warm: '#fbfaf8',
          card: '#ffffff',
          border: '#e8e6e1',
          muted: '#787670',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
