import type { Img } from "@/lib/content";

/** 響應式照片：800／1600 兩種寬度，延遲載入。priority 用在首屏主圖。 */
export function Photo({ img, sizes = "100vw", className = "", priority = false, rounded = true }: { img: Img | null; sizes?: string; className?: string; priority?: boolean; rounded?: boolean }) {
  if (!img) return <div className={`bg-harbor-100 ${rounded ? "rounded-2xl" : ""} ${className}`} aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      alt={img.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`object-cover ${rounded ? "rounded-2xl" : ""} ${className}`}
    />
  );
}
