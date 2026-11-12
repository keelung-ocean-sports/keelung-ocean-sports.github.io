import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: { DEFAULT: "#0B3C49", 900: "#072a33", 700: "#0B3C49", 600: "#11505f" },
        teal: { DEFAULT: "#137C85", 600: "#137C85", 500: "#1a8f99", 100: "#d9eff1" },
        shallow: { DEFAULT: "#B0DDE0", 50: "#eef8f8" },
        sand: { DEFAULT: "#F2E3C6", 50: "#fbf6ec", 700: "#8a6a2f" },
        ink: { DEFAULT: "#1d2a30", soft: "#4a5a61" },
        signal: { go: "#1f7a4d", caution: "#a86400", stop: "#b42318" },
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', "system-ui", "sans-serif"],
        display: ['"Noto Sans TC"', '"PingFang TC"', "system-ui", "sans-serif"],
      },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
