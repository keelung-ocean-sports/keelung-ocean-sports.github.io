"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  pending?: boolean;
  meta?: string;
  date?: string;
  href?: string; // 原活動頁
  hrefLabel?: string;
};

function rocDate(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  return `${Number(iso.slice(0, 4)) - 1911}/${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
}

/**
 * 照片格線＋燈箱。
 * layout="mosaic" 時採大小交錯的編輯式排版（每 6 張的第 1 張放大）。
 * 燈箱支援：方向鍵、Esc、左右滑動、上一張／下一張、圖說、日期與返回原活動頁。
 */
export function Gallery({ items, columns = "sm:grid-cols-2 lg:grid-cols-3", layout = "grid" }: { items: GalleryItem[]; columns?: string; layout?: "grid" | "mosaic" }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const openAt = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = useCallback(() => {
    dialog.current?.close();
    setIndex(null);
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const cur = index !== null ? items[index] : null;
  const mosaic = layout === "mosaic";

  return (
    <>
      <ul className={mosaic ? "grid grid-flow-dense auto-rows-[120px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:grid-cols-4 sm:gap-3" : `grid grid-cols-2 gap-2 sm:gap-3 ${columns}`}>
        {items.map((m, i) => {
          const big = mosaic && i % 6 === 0;
          return (
            <li key={m.id} className={mosaic ? (big ? "col-span-2 row-span-2" : "") : ""}>
              <button
                type="button"
                onClick={() => openAt(i)}
                className={`group relative block w-full overflow-hidden rounded-xl bg-shallow/30 ${mosaic ? "h-full" : "aspect-[4/3]"}`}
                aria-label={`放大檢視：${m.alt}`}
              >
                <Image src={m.src} alt={m.alt} fill sizes={big ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {m.pending ? <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 text-[10px] font-bold text-amber-200">授權待確認</span> : null}
                {m.meta ? <span className="absolute bottom-1.5 left-1.5 rounded bg-white/90 px-1.5 text-[11px] font-bold text-deep">{m.meta}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[100svh] w-full max-w-6xl bg-transparent p-2 backdrop:bg-black/90 sm:p-4"
        aria-label="照片燈箱"
      >
        {cur ? (
          <div className="relative">
            <div
              className="relative mx-auto aspect-[4/3] max-h-[76svh] w-full touch-pan-y select-none"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <Image key={cur.id} src={cur.src} alt={cur.alt} fill sizes="100vw" className="animate-[fade_.25s_ease-out] object-contain" />
              <button type="button" onClick={() => step(-1)} className="absolute left-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:grid" aria-label="上一張"><Icon name="arrow" className="h-5 w-5 rotate-180" /></button>
              <button type="button" onClick={() => step(1)} className="absolute right-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:grid" aria-label="下一張"><Icon name="arrow" className="h-5 w-5" /></button>
            </div>
            <div className="mt-3 flex flex-col gap-3 text-white sm:flex-row sm:items-start sm:justify-between">
              <div className="text-[15px] leading-6">
                <p>
                  {cur.date ? <span className="mr-2 font-bold text-sand">{rocDate(cur.date)}</span> : null}
                  {cur.caption || cur.alt}
                  {cur.pending ? <span className="ml-2 text-amber-200">（肖像授權待確認，僅限預覽）</span> : null}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-white/60">
                  <span>{(index ?? 0) + 1}／{items.length}</span>
                  <span className="sm:hidden">左右滑動切換</span>
                  {cur.href ? (
                    <Link href={cur.href} className="inline-flex items-center gap-1 font-bold text-shallow underline-offset-4 hover:underline" onClick={close}>
                      {cur.hrefLabel || "看這場活動"}<Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  ) : null}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="上一張"><Icon name="arrow" className="h-5 w-5 rotate-180" /></button>
                <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="下一張"><Icon name="arrow" className="h-5 w-5" /></button>
                <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-white text-deep" aria-label="關閉"><Icon name="close" className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
