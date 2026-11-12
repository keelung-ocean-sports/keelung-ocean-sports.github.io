"use client";
import { useState } from "react";

const SCALES = [
  { id: "energy", t: "今天體力", low: "很累", high: "很好" },
  { id: "fear", t: "怕水程度", low: "不怕水", high: "非常怕" },
  { id: "confidence", t: "下水信心", low: "很低", high: "很有信心" },
];

/** 三項自評 1–5 分的體驗版：只在瀏覽器內顯示，不送出、不記錄、不判定下水資格。 */
export function SelfRating() {
  const [v, setV] = useState<Record<string, number>>({});
  const all = SCALES.every((s) => v[s.id]);
  const hint = !all
    ? ""
    : v.energy <= 2 || v.fear >= 4 || v.confidence <= 2
      ? "報到時把這些分數告訴教練，教練可能會安排近岸、跪姿開始或加強陪同。怕水、沒信心都很正常，這不是淘汰。"
      : "看起來狀態不錯。實際分組仍由教練綜合檢測、健康告知與當天海況決定。";
  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold">試試看：三項自評</h3>
      <p className="mt-1 text-sm text-ink-soft">體驗用，不會送出或記錄，也不代表下水資格。</p>
      <div className="mt-5 space-y-5">
        {SCALES.map((s) => (
          <fieldset key={s.id} className="min-w-0">
            <legend className="font-bold text-deep">{s.t}</legend>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-ink-soft">{s.low}</span>
              <div className="flex flex-1 justify-between gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={v[s.id] === n}
                    aria-label={`${s.t} ${n} 分`}
                    onClick={() => setV((o) => ({ ...o, [s.id]: n }))}
                    className={`grid h-11 flex-1 place-items-center rounded-xl text-lg font-black ring-1 transition ${v[s.id] === n ? "bg-teal text-white ring-teal" : "bg-white text-deep ring-deep/15 hover:ring-teal"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="w-14 shrink-0 text-right text-xs text-ink-soft">{s.high}</span>
            </div>
          </fieldset>
        ))}
      </div>
      <p className="mt-5 min-h-[3.5rem] rounded-xl bg-shallow-50 p-4 text-[15px] leading-7" aria-live="polite">{hint || "三項都選好後，這裡會顯示說明。"}</p>
      {Object.keys(v).length ? <button type="button" onClick={() => setV({})} className="mt-3 text-sm font-bold text-teal hover:text-deep">重新選擇</button> : null}
    </div>
  );
}
