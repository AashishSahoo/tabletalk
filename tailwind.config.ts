import type { Config } from "tailwindcss";

// Design tokens for the "receipt ticket" visual language used across the
// customer feedback flow and the admin dashboard. See DESIGN.md for the
// rationale behind the palette and type choices.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#241C12",
          soft: "#4A4034",
          muted: "#8A7F6E",
        },
        ivory: {
          DEFAULT: "#FBF7F0",
          dim: "#F2ECE1",
        },
        espresso: {
          DEFAULT: "#241C12",
          light: "#3A2E1F",
          dark: "#160F09",
        },
        saffron: {
          50: "#FDF4E3",
          100: "#FBE7BE",
          300: "#F3C264",
          500: "#E8A33D",
          600: "#C87F1F",
          700: "#9C6216",
        },
        pine: {
          50: "#EAF0EA",
          200: "#B7CCB9",
          500: "#3E5C41",
          600: "#2F4538",
          700: "#233A2A",
        },
        clay: {
          500: "#B5533C",
          600: "#9A422E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ticket: "0.375rem",
      },
      boxShadow: {
        ticket: "0 1px 2px rgba(36, 28, 18, 0.06), 0 8px 24px -12px rgba(36, 28, 18, 0.25)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "rise-in": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "rise-in": "rise-in 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
      backgroundImage: {
        shimmer:
          "linear-gradient(90deg, rgba(36,28,18,0.04) 0px, rgba(36,28,18,0.10) 40px, rgba(36,28,18,0.04) 80px)",
      },
    },
  },
  plugins: [],
};

export default config;
