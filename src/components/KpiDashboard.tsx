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

function Ring({ pct, label }: { pct: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid h-[68px] w-[68px] shrink-0 place-items-center" aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-shallow/50" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-teal transition-[stroke-dashoffset] duration-1000" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)} />
      </svg>
      <span className="text-[13px] font-black text-deep">{label}</span>
    </span>
  );
}

/** 依確認狀態決定公開方式：已列報＝公開數字；協會確認達標＝顯示達標但不公開名冊人數。 */
function status(k: KpiLite) {
  const pct = k.rate ? Number(k.rate.replace("%", "")) : 0;
  if (k.confirm === "已列報" && k.actual) return { reached: !k.rate || pct >= 100, pct: k.rate ? pct : 100, showActual: true };
  if (k.confirm === "協會確認達標") return { reached: true, pct: 100, showActual: false };
  return { reached: false, pct: 0, showActual: false };
}

export function KpiDashboard({ items }: { items: KpiLite[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const reached = items.filter((k) => status(k).reached).length;
  return (
    <div>
      <p className="mb-4 flex flex-wrap items-center gap-2 text-[15px] text-ink-soft">
        <span className="chip bg-emerald-50 text-emerald-800 ring-emerald-300">已達標 {reached}／{items.length} 項</span>
        點選任一項目，可展開計算方法、執行方式、相關活動與照片。
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((k) => {
          const s = status(k);
          const isOpen = open === k.id;
          return (
            <li key={k.id} className={isOpen ? "sm:col-span-2 lg:col-span-3" : ""}>
              <div className={`card h-full overflow-hidden transition ${isOpen ? "ring-2 ring-teal" : "hover:-translate-y-0.5 hover:shadow-lg"}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`kpi-${k.id}`}
                  onClick={() => setOpen(isOpen ? null : k.id)}
                  className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                >
                  <Ring pct={s.pct} label={s.showActual && k.rate ? k.rate.replace(".0%", "%") : s.reached ? "達標" : "—"} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-bold leading-snug text-deep">{k.name}</span>
                    <span className="mt-1 block text-[15px]">
                      {s.showActual ? (
                        <span className="font-black text-teal">{k.actual}<span className="ml-0.5 text-sm font-bold">{k.actualUnit}</span></span>
                      ) : s.reached ? (
                        <span className="font-bold text-teal">協會確認達標</span>
                      ) : (
                        <span className="font-semibold text-amber-800">{k.confirm}</span>
                      )}
                      <span className="text-ink-soft">｜目標 {k.target} {k.targetUnit}</span>
                    </span>
                  </span>
                  <Icon name="arrow" className={`h-4 w-4 shrink-0 text-teal transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`} />
                  <span className="sr-only">{isOpen ? "收合" : "展開計算與佐證"}</span>
                </button>
                {isOpen ? (
                  <div id={`kpi-${k.id}`} className="border-t border-deep/10 bg-shallow-50/60 p-4 sm:p-6">
                    <dl className="grid gap-4 text-[15px] leading-7 md:grid-cols-2">
                      {[
                        ["成果說明", k.actualNote],
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
                            <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
