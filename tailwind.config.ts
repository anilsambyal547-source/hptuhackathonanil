import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Neuton", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        limebrand: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          DEFAULT: "#bef264",
          dark: "#1a2e05",
        },
        sage: {
          50: "#f8faf5",
          100: "#f0f4eb",
          200: "#e3eadd",
          300: "#ccd7c3",
          400: "#a8b99c",
          500: "#849a75",
          600: "#657958",
          700: "#4f5f45",
          800: "#3f4c37",
          900: "#353f2f",
          950: "#1a2116",
        },
      },
    },
  },
  plugins: [],
};
export default config;
