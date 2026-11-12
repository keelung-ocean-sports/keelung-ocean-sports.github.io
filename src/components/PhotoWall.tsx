"use client";
import { useMemo, useState } from "react";
import { Gallery, type GalleryItem } from "./Gallery";

export type WallItem = GalleryItem & { theme: string };

function Chips({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-bold text-deep">{label}</legend>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ v: "全部", l: "全部" }, ...options].map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => set(o.v)}
            className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-4 text-[15px] font-semibold ring-1 transition ${value === o.v ? "bg-deep text-white ring-deep" : "bg-white text-deep ring-deep/15 hover:ring-teal"}`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** 照片牆：依活動日期與主題篩選，大小交錯排版，點開燈箱可回到原活動頁。 */
export function PhotoWall({ items }: { items: WallItem[] }) {
  const dates = useMemo(() => Array.from(new Set(items.map((m) => m.date || ""))).filter(Boolean).sort(), [items]);
  const themes = useMemo(() => Array.from(new Set(items.map((m) => m.theme))).filter(Boolean), [items]);
  const [date, setDate] = useState("全部");
  const [theme, setTheme] = useState("全部");
  const list = items.filter((m) => (date === "全部" || m.date === date) && (theme === "全部" || m.theme === theme));

  return (
    <div>
      <div className="grid gap-4 rounded-2xl bg-shallow-50 p-4 ring-1 ring-teal/15 sm:p-5">
        <Chips label="活動日期" value={date} set={setDate} options={dates.map((d) => ({ v: d, l: `${Number(d.slice(5, 7))}/${Number(d.slice(8))}` }))} />
        <Chips label="主題" value={theme} set={setTheme} options={themes.map((t) => ({ v: t, l: t }))} />
      </div>
      <p className="my-4 text-sm text-ink-soft" aria-live="polite">共 {list.length} 張照片</p>
      <Gallery key={`${date}-${theme}`} items={list} layout="mosaic" />
    </div>
  );
}
