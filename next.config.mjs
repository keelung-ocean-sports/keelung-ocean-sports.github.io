/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * STATIC_EXPORT=true：輸出成純靜態網站（GitHub Pages 等免費空間）。
 * 此模式不含 /cms-check 與 /api/revalidate（檔名 *.dyn.tsx / *.dyn.ts 不會被建置），
 * 內容檢核改在 GitHub Actions 建置紀錄中顯示。
 */
const STATIC = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: STATIC ? ["tsx", "ts"] : ["dyn.tsx", "dyn.ts", "tsx", "ts"],
  ...(STATIC ? { output: "export", trailingSlash: true } : {}),
  poweredByHeader: false,
  // 讓伺服器端重新產生頁面時也能讀到內建資料（Vercel 等 serverless 環境需要）
  outputFileTracingIncludes: { "/**": ["./content/seed/**"] },
  images: {
    // 靜態版不能即時壓縮圖片，改用預先產生的縮小版（scripts/make_image_variants.py）
    ...(STATIC ? { loader: "custom", loaderFile: "./src/lib/image-loader.ts" } : {}),
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // 允許試算表中填入的 Google Drive 公開縮圖網址（lh3 / drive.google.com）
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
  ...(STATIC
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
