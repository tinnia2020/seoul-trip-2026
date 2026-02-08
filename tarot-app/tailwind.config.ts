import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic Palette
        space: {
          950: '#0B0B15', // Deepest background
          900: '#13132B', // Deep background
          800: '#1C1C3D', // Card background
          700: '#2E2E55', // Lighter card/element
        },
        cosmic: {
          light: '#D0A9F5', // Light purple highlight
          DEFAULT: '#9D4EDD', // Primary purple
          dark: '#5A189A', // Dark purple
          neon: '#E0AAFF', // Glow
        },
        starlight: {
          DEFAULT: '#F8F9FA', // Text white
          muted: '#ADB5BD', // Text gray
          dim: '#495057', // Text dark gray
        },
        glass: {
          stroke: 'rgba(255, 255, 255, 0.1)',
          fill: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Lato', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'pill': '9999px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(to bottom right, #13132B, #2E003E)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
export default config;
