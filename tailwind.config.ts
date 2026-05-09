import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        /* Daily 커스텀 색상 */
        daily: {
          bg:      "var(--bg-main)",
          card:    "var(--bg-card)",
          sidebar: "var(--bg-sidebar)",
          border:  "var(--border-color)",
          text:    "var(--text-primary)",
          sub:     "var(--text-sub)",
          muted:   "var(--text-muted)",
          orange:  "var(--accent-orange)",
          blue:    "var(--accent-blue)",
        },
        category: {
          coral:    "#F2A896",
          mint:     "#A8D4B0",
          sky:      "#A8C8E8",
          lavender: "#C8B8E8",
          sand:     "#E8D8A0",
          rose:     "#E8A8B8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 4px rgba(44,36,22,0.06), 0 2px 12px rgba(44,36,22,0.04)",
        "card-hover": "0 2px 8px rgba(44,36,22,0.10), 0 4px 20px rgba(44,36,22,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
