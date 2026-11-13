import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

/** 每頁獨立的標題、摘要、canonical 與社群分享圖。image 傳完整路徑（含 basePath）。 */
export function meta({ title, description, path, image }: { title?: string; description: string; path: string; image?: string }): Metadata {
  const url = SITE_URL + path;
  const origin = SITE_URL.replace(/\/[^/]*$/, "").replace(/(https?:\/\/[^/]+).*/, "$1");
  const img = image ? (image.startsWith("http") ? image : origin + image) : undefined;
  const full = title ? `${title}｜${SITE_NAME}` : SITE_NAME;
  return {
    title: full,
    description,
    alternates: { canonical: url },
    openGraph: { title: full, description, url, siteName: SITE_NAME, locale: "zh_TW", type: "website", images: img ? [{ url: img }] : undefined },
    twitter: { card: img ? "summary_large_image" : "summary", title: full, description, images: img ? [img] : undefined },
  };
}
