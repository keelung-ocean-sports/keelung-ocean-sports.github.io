"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** 常駐官方 LINE 按鈕：往下捲動後出現在右下角，不遮擋頁首主視覺。 */
export function FloatingLine({ url }: { url?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="加入官方 LINE"
      className={`fixed bottom-4 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-[#06C755] px-5 font-bold text-white shadow-xl shadow-black/20 transition-all duration-300 hover:bg-[#05b14c] focus-visible:outline-offset-4 sm:bottom-6 sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Icon name="line" className="h-6 w-6" />
      <span className="hidden sm:inline">官方 LINE</span>
    </a>
  );
}
