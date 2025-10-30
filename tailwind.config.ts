/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        border: "oklch(var(--border))",
        primary: "oklch(var(--primary))",
        secondary: "oklch(var(--secondary))",
        muted: "oklch(var(--muted))",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
        logo: ["Playfair Display", "serif"],
      },
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
