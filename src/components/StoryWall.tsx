"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type StoryLite = { id: string; year: string; title: string; summary: string; date: string; themes: string[]; cover?: { src: string; alt: string; pending: boolean } };

export function StoryWall({ items }: { items: StoryLite[] }) {
  const themes = useMemo(() => Array.from(new Set(items.flatMap((s) => s.themes))), [items]);
  const years = useMemo(() => Array.from(new Set(items.map((s) => s.year))).sort().reverse(), [items]);
  const months = useMemo(() => Array.from(new Set(items.map((s) => s.date.slice(0, 7)))).sort(), [items]);
  const [theme, setTheme] = useState("全部");
  const [year, setYear] = useState("全部");
  const [month, setMonth] = useState("全部");
  const list = items.filter((s) => (theme === "全部" || s.themes.includes(theme)) && (year === "全部" || s.year === year) && (month === "全部" || s.date.startsWith(month)));

  const Select = ({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { v: string; l: string }[] }) => (
    <label className="flex flex-col gap-1 text-sm font-bold text-deep">
      {label}
      <select value={value} onChange={(e) => set(e.target.value)} className="min-h-[44px] rounded-xl border-0 bg-white px-3 text-[16px] font-normal ring-1 ring-deep/15 focus:ring-2 focus:ring-teal">
        <option value="全部">全部</option>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );

  return (
    <div>
      <div className="grid gap-3 rounded-2xl bg-shallow-50 p-4 ring-1 ring-teal/15 sm:grid-cols-3">
        <Select label="主題" value={theme} set={setTheme} options={themes.map((t) => ({ v: t, l: t }))} />
        <Select label="年度" value={year} set={setYear} options={years.map((y) => ({ v: y, l: `${y}年度` }))} />
        <Select label="活動月份" value={month} set={setMonth} options={months.map((m) => ({ v: m, l: `${Number(m.slice(0, 4)) - 1911}年${Number(m.slice(5))}月` }))} />
      </div>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">共 {list.length} 篇</p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.id} className="card group overflow-hidden">
            <Link href={`/stories/${s.id}`} className="block">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-teal to-deep">
                {s.cover ? <Image src={s.cover.src} alt={s.cover.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /> : null}
                {s.cover?.pending ? <span className="absolute left-2 top-2 rounded bg-black/70 px-2 text-[11px] font-bold text-amber-200">預覽｜肖像授權待確認</span> : null}
              </div>
              <div className="p-5">
                <p className="text-sm font-bold text-teal">{Number(s.date.slice(0, 4)) - 1911}/{s.date.slice(5).replace("-", "/")}｜{s.themes.join("・")}</p>
                <h3 className="mt-1 text-xl font-bold group-hover:text-teal">{s.title}</h3>
                <p className="mt-2 text-[15px] text-ink-soft">{s.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
