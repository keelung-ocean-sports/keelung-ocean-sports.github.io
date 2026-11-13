"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/content";
import { Icon } from "./Icon";

/** 照片牆＋燈箱：點擊放大、左右切換、ESC 關閉、手機滑動、鍵盤可操作。 */
export function Gallery({ images, label = "活動照片" }: { images: Img[]; label?: string }) {
  const [i, setI] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<number | null>(null);
  const close = useCallback(() => { setI(null); opener.current?.focus(); }, []);
  const go = useCallback((d: number) => setI((x) => (x === null ? x : (x + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (i === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = dialog.current?.querySelectorAll<HTMLElement>("button");
        if (!f?.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [i, close, go]);

  if (!images.length) return null;
  const cur = i === null ? null : images[i];
  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3" aria-label={label}>
        {images.map((img, n) => (
          <li key={img.id + n}>
            <button type="button" className="group block w-full overflow-hidden rounded-xl text-left" aria-label={`放大照片：${img.caption || img.alt}`}
              onClick={(e) => { opener.current = e.currentTarget; setI(n); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src.replace("-1600.webp", "-800.webp")} alt={img.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
            </button>
          </li>
        ))}
      </ul>
      {cur && (
        <div ref={dialog} role="dialog" aria-modal="true" aria-label={`${label}（第 ${i! + 1} 張，共 ${images.length} 張）`} tabIndex={-1}
          className="fixed inset-0 z-50 flex flex-col bg-abyss-900/95 text-white outline-none"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="flex items-center justify-between p-3">
            <span className="text-sm text-white/80" aria-live="polite">{i! + 1} / {images.length}</span>
            <button type="button" onClick={close} className="btn px-3 text-white hover:bg-white/10" aria-label="關閉"><Icon name="close" /></button>
          </div>
          <figure className="flex min-h-0 flex-1 flex-col items-center justify-center px-2" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.src} srcSet={cur.srcSet} sizes="100vw" alt={cur.alt} className="max-h-[78vh] max-w-full rounded-lg object-contain" />
            {cur.caption && <figcaption className="mt-3 max-w-2xl px-4 text-center text-sm text-white/90">{cur.caption}</figcaption>}
          </figure>
          <div className="flex justify-center gap-4 p-4">
            <button type="button" onClick={() => go(-1)} className="btn border border-white/40 text-white hover:bg-white/10" aria-label="上一張"><span aria-hidden="true">←</span> 上一張</button>
            <button type="button" onClick={() => go(1)} className="btn border border-white/40 text-white hover:bg-white/10" aria-label="下一張">下一張 <span aria-hidden="true">→</span></button>
          </div>
        </div>
      )}
    </>
  );
}
