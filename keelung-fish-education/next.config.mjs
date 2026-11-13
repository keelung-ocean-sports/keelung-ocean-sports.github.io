/** @type {import('next').NextConfig} */
// 靜態輸出（GitHub Pages）。網址子路徑由 NEXT_PUBLIC_BASE_PATH 決定，
// 預設 /keelung-fish-education；日後改用自訂網域時設為空字串即可。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/keelung-fish-education";

export default {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
