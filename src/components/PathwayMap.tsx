"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export type Stage = { t: string; skill: string; safety: string; join: string; next: string };

/** 7 階段可點選學習地圖：上方為階段軌道，下方展開該階段細節；支援 #stage-N 直接開啟。 */
export function PathwayMap({ stages }: { stages: Stage[] }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const sync = () => {
      const m = /^#stage-(\d+)$/.exec(window.location.hash);
      if (m) {
        const n = Number(m[1]) - 1;
        if (n >= 0 && n < stages.length) setCur(n);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [stages.length]);
  const s = stages[cur];
  const go = (i: number) => {
    setCur(i);
    try { history.replaceState(null, "", `#stage-${i + 1}`); } catch {}
  };

  return (
    <div>
      <ol className="relative -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0" aria-label="學習階段">
        <span className="pointer-events-none absolute left-[calc(100%/14)] right-[calc(100%/14)] top-6 hidden h-1 rounded-full bg-gradient-to-r from-shallow via-teal to-deep sm:block" aria-hidden />
        {stages.map((st, i) => (
          <li key={st.t} id={`stage-${i + 1}`} className="relative w-28 shrink-0 snap-start scroll-mt-32 sm:w-auto">
            <button
              type="button"
              onClick={() => go(i)}
              aria-pressed={cur === i}
              aria-controls="stage-detail"
              className="group flex w-full flex-col items-center gap-2 rounded-2xl p-1 text-center"
            >
              <span className={`relative grid h-12 w-12 place-items-center rounded-full text-xl font-black ring-4 ring-white transition ${cur === i ? "scale-110 bg-sand text-deep shadow-lg" : i < cur ? "bg-teal text-white" : "bg-deep text-sand group-hover:bg-teal"}`}>{i + 1}</span>
              <span className={`text-[15px] font-bold leading-snug ${cur === i ? "text-deep" : "text-ink-soft group-hover:text-deep"}`}>{st.t}</span>
            </button>
          </li>
        ))}
      </ol>

      <div id="stage-detail" className="card mt-6 overflow-hidden" aria-live="polite">
        <div className="flex items-center justify-between gap-4 bg-deep px-6 py-5 text-white">
          <div>
            <p className="text-sm font-bold text-sand">階段 {cur + 1}／{stages.length}</p>
            <h2 className="text-2xl font-black !text-white">{s.t}</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(Math.max(0, cur - 1))} disabled={cur === 0} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30" aria-label="上一階段"><Icon name="arrow" className="h-5 w-5 rotate-180" /></button>
            <button type="button" onClick={() => go(Math.min(stages.length - 1, cur + 1))} disabled={cur === stages.length - 1} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30" aria-label="下一階段"><Icon name="arrow" className="h-5 w-5" /></button>
          </div>
        </div>
        <dl className="grid gap-5 p-6 text-[16px] leading-8 md:grid-cols-3">
          <div><dt className="font-bold text-teal">能力重點</dt><dd className="mt-1">{s.skill}</dd></div>
          <div><dt className="font-bold text-teal">安全重點</dt><dd className="mt-1">{s.safety}</dd></div>
          <div><dt className="font-bold text-teal">可參與活動</dt><dd className="mt-1">{s.join}</dd></div>
        </dl>
        {s.next ? (
          <button type="button" onClick={() => go(cur + 1)} className="flex w-full items-center justify-between border-t border-deep/10 px-6 py-4 text-left font-bold text-deep hover:bg-shallow-50">
            <span>下一步：{s.next}</span><Icon name="arrow" className="h-5 w-5 text-teal" />
          </button>
        ) : (
          <p className="border-t border-deep/10 px-6 py-4 text-[15px] text-ink-soft">最高階段依各專業體系規定取得資格，網站不代為認證。</p>
        )}
      </div>
    </div>
  );
}
