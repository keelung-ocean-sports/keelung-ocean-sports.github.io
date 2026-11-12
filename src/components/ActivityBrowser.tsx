"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ACTIVITY_TYPES } from "@/lib/schema";
import { STATUS_STYLE, TYPE_SHORT, WEEKDAYS, formatDate } from "@/lib/view";
import { Icon } from "./Icon";

export type ActivityLite = {
  id: string;
  year: string;
  name: string;
  types: string[];
  date: string;
  slot: string;
  location: string;
  status: string;
  result: string;
  cover?: { src: string; alt: string; pending: boolean };
};

function monthKey(d: string) {
  return d.slice(0, 7);
}

export function ActivityBrowser({ items, today }: { items: ActivityLite[]; today: string }) {
  const [type, setType] = useState("全部");
  // 網址 ?type=… 在瀏覽器端讀取，讓網站可以輸出成純靜態檔（GitHub Pages）
  const [initialType, setInitialType] = useState<string>();
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type") ?? undefined;
    if (t && (ACTIVITY_TYPES as readonly string[]).includes(t)) {
      setInitialType(t);
      setType(t);
    }
  }, []);
  const [scope, setScope] = useState<"全部" | "近期" | "回顧">("全部");
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = useMemo(
    () =>
      items.filter((a) => {
        if (type !== "全部" && !a.types.includes(type)) return false;
        const past = a.status === "已完成" || a.date < today;
        if (scope === "近期" && past) return false;
        if (scope === "回顧" && !past) return false;
        return true;
      }),
    [items, type, scope, today],
  );

  const months = useMemo(() => Array.from(new Set(items.map((a) => monthKey(a.date)))).sort(), [items]);
  const [month, setMonth] = useState(() => {
    const upcoming = items.find((a) => a.date >= today);
    return upcoming ? monthKey(upcoming.date) : months[months.length - 1] ?? today.slice(0, 7);
  });

  const usedTypes = (ACTIVITY_TYPES as readonly string[]).filter((t) => items.some((a) => a.types.includes(t)));

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl bg-shallow-50 p-4 ring-1 ring-teal/15 sm:p-5">
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-deep">活動類型</legend>
          <div className="flex flex-wrap gap-2">
            {["全部", ...usedTypes, ...(initialType && !usedTypes.includes(initialType) && (ACTIVITY_TYPES as readonly string[]).includes(initialType) ? [initialType] : [])].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`min-h-[40px] rounded-full px-4 text-[15px] font-semibold ring-1 transition ${type === t ? "bg-deep text-white ring-deep" : "bg-white text-deep ring-deep/15 hover:ring-teal"}`}
              >
                {t === "全部" ? "全部" : TYPE_SHORT[t] ?? t}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">時間範圍</legend>
            {(["全部", "近期", "回顧"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={scope === s}
                onClick={() => setScope(s)}
                className={`min-h-[40px] rounded-full px-4 text-[15px] font-semibold ${scope === s ? "bg-teal text-white" : "bg-white text-deep ring-1 ring-deep/15"}`}
              >
                {s === "近期" ? "近期活動" : s === "回顧" ? "活動回顧" : "全部時間"}
              </button>
            ))}
          </fieldset>
          <div className="flex rounded-full bg-white p-1 ring-1 ring-deep/15" role="group" aria-label="顯示方式">
            {(["list", "calendar"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`min-h-[36px] rounded-full px-4 text-sm font-bold ${view === v ? "bg-deep text-white" : "text-deep"}`}
              >
                {v === "list" ? "列表" : "月曆"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">共 {filtered.length} 場活動</p>

      {view === "list" ? (
        filtered.length ? (
          <ol className="mt-4 grid gap-4">
            {filtered.map((a) => (
              <li key={a.id}>
                <Link href={`/activities/${a.id}`} className="card group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex shrink-0 items-center gap-4 sm:w-40 sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-3xl font-black text-deep">{Number(a.date.slice(5, 7))}/{Number(a.date.slice(8, 10))}</span>
                    <span className="text-sm font-semibold text-ink-soft">
                      {Number(a.date.slice(0, 4)) - 1911}年｜週{formatDate(a.date).weekday}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`chip ${STATUS_STYLE[a.status]?.className ?? ""}`}>{STATUS_STYLE[a.status]?.label ?? a.status}</span>
                      {a.types.map((t) => (
                        <span key={t} className="rounded-full bg-shallow/40 px-2.5 py-0.5 text-[13px] font-semibold text-deep">{TYPE_SHORT[t] ?? t}</span>
                      ))}
                    </div>
                    <h3 className="mt-2 text-lg font-bold group-hover:text-teal">{a.name}</h3>
                    <p className="text-[15px] text-ink-soft">{a.location || "地點依公告"}｜{a.slot || "時間依公告"}</p>
                    {a.result ? <p className="mt-1 text-sm text-teal">{a.result}</p> : null}
                  </div>
                  <Icon name="arrow" className="hidden h-5 w-5 text-teal sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 rounded-2xl border-2 border-dashed border-deep/15 p-8 text-center text-ink-soft">這個條件下目前沒有活動。</p>
        )
      ) : (
        <Calendar items={filtered} months={months} month={month} setMonth={setMonth} />
      )}
    </div>
  );
}

function Calendar({ items, months, month, setMonth }: { items: ActivityLite[]; months: string[]; month: string; setMonth: (m: string) => void }) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const idx = months.indexOf(month);
  const go = (d: number) => {
    const next = new Date(Date.UTC(y, m - 1 + d, 1));
    setMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`);
  };
  const byDay = new Map<number, ActivityLite[]>();
  items.filter((a) => a.date.startsWith(month)).forEach((a) => {
    const d = Number(a.date.slice(8, 10));
    byDay.set(d, [...(byDay.get(d) ?? []), a]);
  });

  return (
    <div className="mt-4 card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-deep/15" aria-label="上個月">
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
        </button>
        <h3 className="text-xl font-black" aria-live="polite">{y - 1911}年 {m}月</h3>
        <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-deep/15" aria-label="下個月">
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>
      {months.length > 1 ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {months.map((mm) => (
            <button key={mm} type="button" onClick={() => setMonth(mm)} aria-pressed={mm === month}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${mm === month ? "bg-deep text-white" : "bg-shallow/30 text-deep"}`}>
              {Number(mm.slice(0, 4)) - 1911}/{Number(mm.slice(5))}
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-bold text-ink-soft" aria-hidden>
        {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const list = d ? byDay.get(d) ?? [] : [];
          return (
            <div key={i} className={`min-h-[64px] rounded-lg p-1 text-left sm:min-h-[92px] sm:p-1.5 ${d ? "bg-shallow-50" : ""} ${list.length ? "ring-2 ring-teal" : ""}`}>
              {d ? <span className="text-[13px] font-bold text-deep">{d}</span> : null}
              {list.map((a) => (
                <Link key={a.id} href={`/activities/${a.id}`} className="mt-0.5 block truncate rounded bg-deep px-1 py-0.5 text-[11px] font-semibold text-white sm:text-[12px]" title={a.name}>
                  {a.types[0] ? TYPE_SHORT[a.types[0]] ?? a.types[0] : a.name}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
      {idx === -1 && byDay.size === 0 ? <p className="mt-4 text-center text-sm text-ink-soft">本月沒有活動。</p> : null}
    </div>
  );
}
