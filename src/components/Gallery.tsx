"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type GalleryItem = { id: string; src: string; alt: string; caption?: string; pending?: boolean; meta?: string };

export function Gallery({ items, columns = "sm:grid-cols-2 lg:grid-cols-3" }: { items: GalleryItem[]; columns?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

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

  return (
    <>
      <ul className={`grid grid-cols-2 gap-2 sm:gap-3 ${columns}`}>
        {items.map((m, i) => (
          <li key={m.id}>
            <button type="button" onClick={() => openAt(i)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-shallow/30" aria-label={`放大檢視：${m.alt}`}>
              <Image src={m.src} alt={m.alt} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              {m.pending ? <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 text-[10px] font-bold text-amber-200">授權待確認</span> : null}
              {m.meta ? <span className="absolute bottom-1.5 left-1.5 rounded bg-white/90 px-1.5 text-[11px] font-bold text-deep">{m.meta}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[100svh] w-full max-w-5xl bg-transparent p-2 backdrop:bg-black/85 sm:p-4"
        aria-label="照片燈箱"
      >
        {cur ? (
          <div className="relative">
            <div className="relative mx-auto aspect-[4/3] max-h-[78svh] w-full">
              <Image src={cur.src} alt={cur.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="mt-3 flex items-start justify-between gap-4 text-white">
              <p className="text-[15px] leading-6">
                {cur.caption || cur.alt}
                {cur.pending ? <span className="ml-2 text-amber-200">（肖像授權待確認，僅限預覽）</span> : null}
                <span className="ml-2 text-white/60">{(index ?? 0) + 1}／{items.length}</span>
              </p>
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
