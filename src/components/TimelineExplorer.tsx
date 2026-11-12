"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "./Icon";

export type TimelineEntry = {
  key: string;
  date: string;
  label: string;
  kind: "里程碑" | "水域活動" | "共融" | "競賽" | "培訓";
  title: string;
  body: string;
  headcount?: string;
  href?: string;
  storyHref?: string;
  photo?: { src: string; alt: string };
  source?: string;
};

const KIND_STYLE: Record<TimelineEntry["kind"], string> = {
  里程碑: "bg-sand text-deep",
  水域活動: "bg-teal text-white",
  共融: "bg-violet-600 text-white",
  競賽: "bg-amber-500 text-deep",
  培訓: "bg-deep text-white",
};

/** 年度歷程互動時間軸：可依月份與類別篩選，活動節點附照片、人次、故事與活動頁連結。桌機為橫式卡片，避免左右交錯造成大片空白。 */
export function TimelineExplorer({ entries }: { entries: TimelineEntry[] }) {
  const months = useMemo(() => Array.from(new Set(entries.map((e) => e.date.slice(0, 7)))).sort(), [entries]);
  const kinds = useMemo(() => (Object.keys(KIND_STYLE) as TimelineEntry["kind"][]).filter((k) => entries.some((e) => e.kind === k)), [entries]);
  const [month, setMonth] = useState("全部");
  const [kind, setKind] = useState("全部");
  const list = entries.filter((e) => (month === "全部" || e.date.startsWith(month)) && (kind === "全部" || e.kind === kind));

  const btn = (active: boolean) =>
    `min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-4 text-[15px] font-semibold ring-1 transition ${active ? "bg-deep text-white ring-deep" : "bg-white text-deep ring-deep/15 hover:ring-teal"}`;

  return (
    <div>
      <div className="grid gap-3 rounded-2xl bg-shallow-50 p-4 ring-1 ring-teal/15 sm:p-5">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="依月份篩選">
          <button type="button" aria-pressed={month === "全部"} onClick={() => setMonth("全部")} className={btn(month === "全部")}>全年</button>
          {months.map((m) => (
            <button key={m} type="button" aria-pressed={month === m} onClick={() => setMonth(m)} className={btn(month === m)}>{Number(m.slice(5))}月</button>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="依類別篩選">
          <button type="button" aria-pressed={kind === "全部"} onClick={() => setKind("全部")} className={btn(kind === "全部")}>全部類別</button>
          {kinds.map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={btn(kind === k)}>
              <span className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-full ${KIND_STYLE[k].split(" ")[0]}`} />{k}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">共 {list.length} 個節點</p>

      <ol className="relative mt-6 space-y-5 before:absolute before:bottom-0 before:left-[19px] before:top-0 before:w-0.5 before:bg-shallow sm:before:left-[27px]">
        {list.map((e) => (
          <li key={e.key} className="relative grid grid-cols-[40px_1fr] gap-3 sm:grid-cols-[56px_1fr] sm:gap-5">
            <span className={`relative z-10 mt-4 grid h-10 w-10 place-items-center rounded-full text-[11px] font-black ring-4 ring-white sm:h-14 sm:w-14 sm:text-[13px] ${KIND_STYLE[e.kind]}`}>
              {Number(e.date.slice(5, 7))}/{Number(e.date.slice(8))}
            </span>
            <div className={`card overflow-hidden ${e.photo ? "sm:grid sm:grid-cols-[minmax(0,300px)_1fr]" : ""}`}>
              {e.photo ? (
                <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-[180px]">
                  <Image src={e.photo.src} alt={e.photo.alt} fill sizes="(max-width: 640px) 90vw, 300px" className="object-cover" />
                  {e.headcount ? (
                    <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-3 py-1 text-sm font-black text-deep shadow">{e.headcount} 人次</span>
                  ) : null}
                </div>
              ) : null}
              <div className="p-5">
                <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-teal">
                  {e.label}
                  <span className={`rounded px-1.5 py-0.5 text-xs ${KIND_STYLE[e.kind]}`}>{e.kind}</span>
                  {!e.photo && e.headcount ? <span className="text-deep">｜名冊 {e.headcount} 人次</span> : null}
                </p>
                <h3 className="mt-1 text-lg font-bold leading-snug text-deep">{e.title}</h3>
                {e.body ? <p className="mt-1 text-[15px] leading-7 text-ink-soft">{e.body}</p> : null}
                {e.source ? <p className="mt-1 text-xs text-ink-soft/80">來源：{e.source}</p> : null}
                {e.href || e.storyHref ? (
                  <p className="mt-3 flex flex-wrap gap-4 text-[15px] font-bold">
                    {e.href ? <Link href={e.href} className="inline-flex items-center gap-1 text-teal hover:text-deep">活動紀錄<Icon name="arrow" className="h-4 w-4" /></Link> : null}
                    {e.storyHref ? <Link href={e.storyHref} className="inline-flex items-center gap-1 text-teal hover:text-deep">海洋故事<Icon name="arrow" className="h-4 w-4" /></Link> : null}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
