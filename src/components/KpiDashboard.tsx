"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

export type KpiLite = {
  id: string;
  name: string;
  target: string;
  targetUnit: string;
  actual: string;
  actualUnit: string;
  actualNote: string;
  period: string;
  method: string;
  execution: string;
  evidence: string;
  confirm: string;
  rate: string | null;
  feedback: string;
  note: string;
  activities: { id: string; label: string }[];
  photos: { id: string; src: string; alt: string; pending: boolean }[];
};

const CONFIRM_STYLE: Record<string, string> = {
  已列報: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  待補佐證: "bg-amber-50 text-amber-900 ring-amber-300",
  待確認: "bg-slate-100 text-slate-700 ring-slate-300",
  未達成: "bg-rose-50 text-rose-800 ring-rose-300",
};

export function KpiDashboard({ items }: { items: KpiLite[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="grid gap-3">
      {items.map((k) => {
        const showActual = k.confirm === "已列報" && k.actual;
        const pct = k.rate ? Math.min(Number(k.rate.replace("%", "")), 100) : 0;
        const isOpen = open === k.id;
        return (
          <li key={k.id} className="card overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`kpi-${k.id}`}
              onClick={() => setOpen(isOpen ? null : k.id)}
              className="grid w-full gap-3 p-4 text-left sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center sm:p-5"
            >
              <span>
                <span className="block text-lg font-bold text-deep">{k.name}</span>
                <span className={`chip mt-1 !py-0.5 text-xs ${CONFIRM_STYLE[k.confirm] ?? ""}`}>{k.confirm}</span>
              </span>
              <span className="text-[15px]">
                <span className="block text-xs font-bold text-ink-soft">核定目標</span>
                <span className="font-bold text-deep">{k.target} {k.targetUnit}</span>
              </span>
              <span className="text-[15px]">
                <span className="block text-xs font-bold text-ink-soft">期末實績</span>
                {showActual ? (
                  <span className="font-black text-teal">
                    {k.actual} {k.actualUnit}
                    {k.rate ? <span className="ml-1 text-sm font-bold text-ink-soft">（{k.rate}）</span> : null}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-amber-800">依協會另附名冊列報，網站暫不公開數字</span>
                )}
                {showActual && k.rate ? (
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-shallow/40" aria-hidden>
                    <span className="block h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
                  </span>
                ) : null}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-teal">
                {isOpen ? "收合" : "計算與佐證"}
                <Icon name="arrow" className={`h-4 w-4 transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`} />
              </span>
            </button>
            {isOpen ? (
              <div id={`kpi-${k.id}`} className="border-t border-deep/10 bg-shallow-50/60 p-4 sm:p-6">
                <dl className="grid gap-4 text-[15px] leading-7 md:grid-cols-2">
                  {[
                    ["指標說明", k.actualNote],
                    ["執行方法", k.execution],
                    ["計算基礎", k.method],
                    ["統計期間", k.period],
                    ["佐證索引（去識別化）", k.evidence],
                    ["相關回饋", k.feedback],
                    ["備註", k.note],
                  ]
                    .filter(([, v]) => v)
                    .map(([t, v]) => (
                      <div key={t}>
                        <dt className="font-bold text-deep">{t}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                </dl>
                {k.activities.length ? (
                  <div className="mt-5">
                    <p className="text-sm font-bold text-deep">相關活動</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {k.activities.map((a) => (
                        <li key={a.id}><Link href={`/activities/${a.id}`} className="inline-flex min-h-[36px] items-center rounded-full bg-white px-3 text-sm font-semibold text-deep ring-1 ring-deep/15 hover:ring-teal">{a.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {k.photos.length ? (
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {k.photos.map((p) => (
                      <div key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover" />
                        {p.pending ? <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px] font-bold text-amber-200">授權待確認</span> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
