import Image from "next/image";
import type { Media } from "@/lib/cms-types";

/** 顯示照片；「授權待確認」的照片只會在預覽模式出現，並加上明顯標記。 */
export function Photo({
  m,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  fill = true,
  caption = false,
}: {
  m: Media;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  caption?: boolean;
}) {
  // 呼叫端指定 absolute/fixed 時不可再加 relative（Tailwind 中 relative 會蓋過 absolute，照片高度變 0 而看不見）
  const position = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative ";
  return (
    <figure className={`${position}overflow-hidden ${className}`}>
      {fill ? (
        <Image src={m.src} alt={m.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <Image src={m.src} alt={m.alt} width={1200} height={900} sizes={sizes} priority={priority} className="h-auto w-full" />
      )}
      {m.consent !== "已授權" ? (
        <span className="absolute left-2 top-2 z-10 rounded bg-black/70 px-2 py-0.5 text-[11px] font-bold text-amber-200">
          預覽｜肖像授權待確認
        </span>
      ) : null}
      {caption && m.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-[13px] leading-5 text-white">
          {m.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
