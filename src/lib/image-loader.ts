import manifest from "./image-manifest.json";

/**
 * 靜態網站（GitHub Pages）的圖片載入器：
 * 有預先產生縮小版的照片，依螢幕需要的寬度挑選 640／1080 版本；其他圖片（Logo、外部網址）原樣輸出。
 */
const variants = manifest as Record<string, number[]>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const sizes = variants[src];
  if (!sizes) return src;
  const w = sizes.find((x) => x >= width);
  // 高解析手機（3 倍）要求寬度略超過最大縮圖時，仍用最大縮圖，避免下載 1920px 原檔。
  const pick = w ?? (width <= sizes[sizes.length - 1] * 1.35 ? sizes[sizes.length - 1] : undefined);
  return pick ? `/media/_w/${pick}${src.slice("/media".length)}` : src;
}
