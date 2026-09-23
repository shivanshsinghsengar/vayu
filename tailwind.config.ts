import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vayu Holidays Design System
        vayu: {
          // Primary — Deep Forest Green
          50:  "#f0f7f4",
          100: "#dcede6",
          200: "#bbdacd",
          300: "#8ec0ad",
          400: "#5ea08a",
          500: "#3d8470",
          600: "#2d6a5a",
          700: "#255549",
          800: "#1e433b",
          900: "#193832",
          950: "#0d201d",
        },
        sand: {
          // Secondary — Warm Sand
          50:  "#faf8f5",
          100: "#f3ede4",
          200: "#e6d9c8",
          300: "#d4bfa3",
          400: "#bfa07d",
          500: "#b08860",
          600: "#a37451",
          700: "#885f44",
          800: "#6f4e3a",
          900: "#5b4031",
          950: "#301f17",
        },
        cream: "#FAF8F5",
        "off-white": "#F5F2ED",
        charcoal: {
          DEFAULT: "#1a1a1a",
          800: "#2a2a2a",
          700: "#3a3a3a",
          600: "#4a4a4a",
          500: "#5a5a5a",
          400: "#7a7a7a",
          300: "#9a9a9a",
          200: "#c0c0c0",
          100: "#e0e0e0",
        },
        // Shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-md":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.25", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "ken-burns": "kenBurns 20s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        kenBurns: {
          "0%":   { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.08) translate(-2%, -1%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.7) 100%)",
        "card-gradient": "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)",
      },
      boxShadow: {
        "card":    "0 2px 20px rgba(0,0,0,0.08)",
        "card-md": "0 4px 32px rgba(0,0,0,0.12)",
        "card-lg": "0 8px 48px rgba(0,0,0,0.16)",
        "float":   "0 20px 60px rgba(0,0,0,0.15)",
        "planner": "0 24px 80px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
