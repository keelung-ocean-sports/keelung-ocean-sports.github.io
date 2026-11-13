"use client";
import { useMemo, useState } from "react";
import { ActivityCard, TileCard, type ActivityCardData } from "./cards";
import type { Img } from "@/lib/content";

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="mb-6">
      <legend className="mb-2 text-sm font-bold text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {["全部", ...options].map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
            className={`min-h-[44px] rounded-full px-4 text-[15px] font-semibold ring-1 transition ${value === o ? "bg-abyss text-white ring-abyss" : "bg-white text-abyss ring-abyss/20 hover:bg-harbor-50"}`}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ActivityBrowser({ items }: { items: ActivityCardData[] }) {
  const [type, setType] = useState("全部");
  const [year, setYear] = useState("全部");
  const types = useMemo(() => [...new Set(items.map((a) => a.type))], [items]);
  const years = useMemo(() => [...new Set(items.map((a) => a.year))].sort().reverse(), [items]);
  const shown = items.filter((a) => (type === "全部" || a.type === type) && (year === "全部" || a.year === year));
  return (
    <>
      <div className="grid gap-x-8 sm:grid-cols-2">
        {years.length > 1 && <Chips label="年度" options={years.map((y) => y)} value={year} onChange={setYear} />}
        <Chips label="活動類型" options={types} value={type} onChange={setType} />
      </div>
      <p role="status" className="mb-4 text-sm text-ink-soft">共 {shown.length} 場</p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => <li key={a.slug}><ActivityCard a={a} /></li>)}
      </ul>
    </>
  );
}

export type SpeciesCardData = { slug: string; name: string; localName: string; category: string; features: string; img: Img | null };
export function SpeciesBrowser({ items, categories }: { items: SpeciesCardData[]; categories: string[] }) {
  const [cat, setCat] = useState("全部");
  const shown = items.filter((s) => cat === "全部" || s.category === cat);
  const used = categories.filter((c) => items.some((s) => s.category === c));
  return (
    <>
      <Chips label="分類" options={used} value={cat} onChange={setCat} />
      <p role="status" className="mb-4 text-sm text-ink-soft">共 {shown.length} 種</p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.slug}><TileCard href={`/species/${s.slug}/`} title={s.name} sub={s.localName} tag={s.category} body={s.features} img={s.img} /></li>
        ))}
      </ul>
    </>
  );
}
