import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0B0C0E", // Primary luxury dark canvas
          900: "#111215", // Elevated cards & panels
          850: "#16181D", // Interactive surfaces & dropdowns
          800: "#1E2026", // Structural borders & dividers
          700: "#2A2D35",
          600: "#3B3F4A",
          deep: "#141414", // V2 Signature Deep Charcoal
          soft: "#1D1D1B", // V2 Soft Black
        },
        gold: {
          100: "#FAF4EC",
          200: "#F0E4D0",
          300: "#E8BE63", // V2 Bright Gold Highlight
          400: "#D4A84F", // V2 Signature Luxury Gold
          500: "#D4A84F", // V2 Primary Luxury Gold
          600: "#B88E36",
          700: "#916F24",
          800: "#6B5018",
          bright: "#E8BE63", // V2 Radiant Gold Highlight
          champagne: "#E8D3A5", // V2 Soft Champagne Gold
          muted: "#C5A880", // V2 Restrained Antique Gold
        },
        ivory: {
          50: "#FCFBF9",
          100: "#F7F5F0", // Primary warm ivory text
          200: "#EAE6DF", // Secondary editorial text
          300: "#DAD4C8",
          400: "#C5BFB2",
          warm: "#F5F0E6", // V2 Signature Warm Ivory Surface
          paper: "#FAF8F5", // V2 Crisp Light Canvas
          card: "#EFE9DC", // V2 Elevated Warm Ivory Card
          border: "#DDD5C5", // V2 Hairline Light Border
          text: "#1D1D1B", // V2 High-contrast text on light
          textMuted: "#5C574F",
        },
        champagne: {
          100: "#FAF7F2",
          200: "#F4EFE6",
          500: "#E8D3A5", // V2 Signature Champagne
          700: "#C5B491",
        },
        taupe: {
          300: "#ABA091",
          500: "#8D806D", // V2 Warm Taupe
          700: "#625746",
        },
        sand: {
          300: "#C7C4BC",
          400: "#A39F97", // Muted descriptions
          500: "#75726D",
          600: "#504E4A",
          700: "#383633",
        },
        bronze: {
          border: "#232428", // Subtle luxury borders
          subtle: "#191A1E",
          hover: "#34363D",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": [
          "4.5rem",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ], // 72px
        "display-xl": [
          "3.75rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ], // 60px
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }], // 48px
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "0em" }], // 36px
        "display-sm": ["1.75rem", { lineHeight: "1.3", letterSpacing: "0.01em" }], // 28px
        "body-lg": ["1.125rem", { lineHeight: "1.75" }],
        "body-base": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.05em" },
        ],
        overline: [
          "0.6875rem",
          { lineHeight: "1.2", letterSpacing: "0.22em" },
        ],
      },
      letterSpacing: {
        widest: "0.25em",
        editorial: "0.15em",
        tightest: "-0.03em",
      },
      aspectRatio: {
        portrait: "3 / 4",
        gallery: "4 / 5",
        cinematic: "16 / 9",
        editorial: "2 / 3",
      },
      boxShadow: {
        "gold-subtle": "0 0 35px -10px rgba(197, 168, 128, 0.15)",
        "gold-glow": "0 0 50px -10px rgba(212, 175, 55, 0.25)",
        "card-luxury": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "shimmer-luxury": "shimmer 2.2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
