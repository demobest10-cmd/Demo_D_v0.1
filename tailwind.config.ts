import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef5ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      boxShadow: {
        soft: "0 10px 35px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1d4ed8 0%, #2563eb 35%, #60a5fa 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
