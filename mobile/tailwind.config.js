/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 + Tailwind v3 line (see client/styles/globals.css for the
  // canonical brand tokens - these are the same values, ported to a flat RN
  // palette since React Native can't resolve CSS custom properties at
  // runtime the way the web client can). Dark mode intentionally deferred -
  // see mobile/README.md backlog.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#eae3d6",
        surface: "#f6f1e7",
        "surface-hover": "#efe8d8",
        "surface-elevated": "#15130f",
        ink: "#17140f",
        "ink-muted": "#8a8375",
        line: "#ddd3bf",
        brand: "#e2543c",
        "brand-foreground": "#f6f1e7",
        positive: "#3e9950",
        "on-elevated": "#f2ecdf",
      },
      borderRadius: {
        card: 16,
      },
    },
  },
  plugins: [],
};
