import type { Config } from "tailwindcss";

// Shared visual tokens. Semantic names keep the components decoupled from the
// brand palette, so a palette change does not alter app behaviour.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crushed: {
          berry: "#880D1E",
        },
        raspberry: "#DD2D4A",
        bubblegum: {
          pink: "#F26A8D",
        },
        pink: {
          mist: "#F49CBB",
        },
        light: {
          cyan: "#CBEEF3",
        },
        ink: {
          DEFAULT: "#3C1020",
          soft: "#661B31",
          muted: "#936271",
        },
        ivory: {
          DEFAULT: "#F7FCFD",
          dim: "#E7F8FA",
        },
        espresso: {
          DEFAULT: "#880D1E",
          light: "#A5172D",
          dark: "#640715",
        },
        saffron: {
          50: "#FFF1F5",
          100: "#FDE0E8",
          300: "#F49CBB",
          500: "#DD2D4A",
          600: "#B91E39",
          700: "#880D1E",
        },
        pine: {
          50: "#E8F9FB",
          200: "#B4E4EB",
          500: "#167785",
          600: "#0E6170",
          700: "#094C58",
        },
        clay: {
          500: "#DD2D4A",
          600: "#B91E39",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ticket: "0.875rem",
      },
      boxShadow: {
        ticket: "0 2px 4px rgba(136, 13, 30, 0.04), 0 18px 45px -22px rgba(136, 13, 30, 0.24)",
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
          "linear-gradient(90deg, rgba(221,45,74,0.04) 0px, rgba(244,156,187,0.22) 40px, rgba(221,45,74,0.04) 80px)",
      },
    },
  },
  plugins: [],
};

export default config;
