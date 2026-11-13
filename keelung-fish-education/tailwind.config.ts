import type { Config } from "tailwindcss";

// 設計系統：深海藍／港灣藍／青綠／白，珊瑚橘只用在食物與行動提示。
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: { DEFAULT: "#0A2E42", 900: "#061f2d", 800: "#0A2E42", 700: "#103f59" },
        harbor: { DEFAULT: "#1F6E99", 600: "#1F6E99", 500: "#2b85b5", 100: "#dcedf6", 50: "#f0f7fb" },
        tide: { DEFAULT: "#0B6A5C", 600: "#0B6A5C", 500: "#1a9a86", 100: "#d6f0ea" },
        coral: { DEFAULT: "#C24E2C", 600: "#C24E2C", 500: "#e0663f", 100: "#fbe6dd" },
        sand: { DEFAULT: "#F6EFE3", 50: "#fbf8f2" },
        ink: { DEFAULT: "#17262f", soft: "#46565f" },
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', "system-ui", "sans-serif"],
        serif: ['"Noto Serif TC"', '"Songti TC"', "serif"],
      },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
