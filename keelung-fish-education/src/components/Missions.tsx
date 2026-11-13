"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/**
 * 親子任務：進度只存在這台裝置的 localStorage，不收集姓名、電話或任何個資。
 */
const KEY = "kfe-missions-v1";
type State = { m1: string[]; m2: Record<string, string>; m3: string[]; m4: string[] };
const EMPTY: State = { m1: [], m2: {}, m3: [], m4: [] };

const M1 = ["鎖管", "白帶魚", "當季底棲魚", "蝦類", "螃蟹", "貝類", "海菜", "其他魚類"];
const M2 = [
  { gear: "棒受網", hint: "夜間開集魚燈，用網子從下方撈起", answer: ["鎖管"] },
  { gear: "延繩釣", hint: "一條長繩上掛很多釣鉤", answer: ["白帶魚"] },
  { gear: "籠具", hint: "放到海底的籠子，進得去出不來", answer: ["蝦蟹"] },
  { gear: "一支釣", hint: "一條線，一次釣一尾", answer: ["白帶魚", "鎖管"] },
];
const M2_OPTIONS = ["鎖管", "白帶魚", "蝦蟹"];
const M3 = ["一種海藻或海菜", "一種甲殼類或貝類", "一個棲地特徵（岩石、水窪、沙礫…）"];
const M4 = ["我說得出今天料理用了哪一種海味", "我知道它可能是怎麼被捕到的", "我知道它從哪裡來（市場、漁港、在地）", "我願意下次買海鮮時多問一句"];

function load(): State {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); return v ? { ...EMPTY, ...v } : EMPTY; } catch { return EMPTY; }
}

export function Missions() {
  const [s, setS] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => { setS(load()); setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s, ready]);

  const toggle = (k: "m1" | "m3" | "m4", v: string) => setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  const done = {
    m1: s.m1.length >= 3,
    m2: M2.every((q) => q.answer.includes(s.m2[q.gear])),
    m3: M3.every((x) => s.m3.includes(x)),
    m4: s.m4.length >= 2,
  };
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 mb-8 border-b border-abyss/10 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <p className="flex items-center justify-between text-sm font-semibold text-abyss">
          <span>任務進度</span><span role="status">{count} / 4 完成</span>
        </p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-harbor-100" aria-hidden="true">
          <div className="h-full rounded-full bg-coral-600 transition-all" style={{ width: `${count * 25}%` }} />
        </div>
      </div>

      <Mission n={1} title="海鮮偵探" place="市場" done={done.m1} goal="在市場找到 3 種水產品，找到就點一下。">
        <div className="flex flex-wrap gap-2">
          {M1.map((x) => <Check key={x} on={s.m1.includes(x)} onClick={() => toggle("m1", x)}>{x}</Check>)}
        </div>
      </Mission>

      <Mission n={2} title="漁法配對" place="漁港" done={done.m2} goal="這種漁法最可能捕到什麼？每一題選一個答案。">
        <div className="grid gap-4 sm:grid-cols-2">
          {M2.map((q) => {
            const pick = s.m2[q.gear];
            const right = q.answer.includes(pick);
            return (
              <fieldset key={q.gear} className="rounded-xl bg-harbor-50 p-4">
                <legend className="sr-only">{q.gear}</legend>
                <p className="font-bold text-abyss" aria-hidden="true">{q.gear}</p>
                <p className="text-sm text-ink-soft">{q.hint}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {M2_OPTIONS.map((o) => (
                    <button key={o} type="button" aria-pressed={pick === o} onClick={() => setS((p) => ({ ...p, m2: { ...p.m2, [q.gear]: o } }))}
                      className={`min-h-[44px] rounded-full px-4 font-semibold ring-1 ${pick === o ? (right ? "bg-tide-600 text-white ring-tide-600" : "bg-coral-100 text-coral-600 ring-coral-500") : "bg-white text-abyss ring-abyss/20"}`}>{o}</button>
                  ))}
                </div>
                <p role="status" className="mt-2 min-h-[1.5rem] text-sm">
                  {pick ? (right ? "✓ 答對了！" : "再想想看：看看提示，或問問漁人。") : ""}
                </p>
              </fieldset>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-ink-soft">同一種魚可以用不同漁法捕到；這裡的答案是課程中的代表例子。</p>
      </Mission>

      <Mission n={3} title="潮間帶觀察家" place="潮間帶" done={done.m3} goal="在安全的地方找到下面三樣東西。觀察就好，不帶走。">
        <div className="flex flex-wrap gap-2">
          {M3.map((x) => <Check key={x} on={s.m3.includes(x)} onClick={() => toggle("m3", x)}>{x}</Check>)}
        </div>
        <p className="mt-3 rounded-xl bg-tide-100 p-3 text-sm text-abyss"><strong>觀察，不帶走。</strong>看完把石頭翻回原位；不適合下潮間帶時，在岸上觀察站用圖卡完成也算數。</p>
      </Mission>

      <Mission n={4} title="海味料理家" place="餐桌" done={done.m4} goal="今天這道菜從哪裡來？勾選你做得到的（至少 2 項）。">
        <div className="flex flex-wrap gap-2">
          {M4.map((x) => <Check key={x} on={s.m4.includes(x)} onClick={() => toggle("m4", x)}>{x}</Check>)}
        </div>
      </Mission>

      {count === 4 ? (
        <section aria-labelledby="done-title" className="mt-10 rounded-3xl bg-abyss p-8 text-center text-white">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral-600"><Icon name="star" className="h-8 w-8" /></div>
          <h2 id="done-title" className="mt-4 text-3xl text-white">八斗子海味小偵探</h2>
          <p className="mt-1 text-xl font-bold text-tide-100">任務完成！</p>
          <p className="mx-auto mt-3 max-w-md text-white/85">市場辨識 × 漁法理解 × 海岸觀察 × 海味餐桌。截圖這張卡，和家人分享今天學到的事。</p>
          <button type="button" className="btn-ghost mt-6" onClick={() => { if (confirm("確定要清除這台裝置上的任務進度嗎？")) setS(EMPTY); }}>重新開始</button>
        </section>
      ) : (
        <p className="mt-8 text-center text-sm text-ink-soft">完成 4 個任務，就會出現你的數位完成卡。</p>
      )}
    </div>
  );
}

function Mission({ n, title, place, goal, done, children }: { n: number; title: string; place: string; goal: string; done: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`m${n}`} className="mb-8 rounded-3xl bg-white p-5 ring-1 ring-abyss/10 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">任務 {n}｜{place}</p>
          <h2 id={`m${n}`} className="mt-1 text-2xl">{title}</h2>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${done ? "bg-tide-600 text-white" : "bg-harbor-100 text-ink-soft"}`}>{done ? "✓ 完成" : "進行中"}</span>
      </div>
      <p className="mb-4 mt-2 text-ink-soft">{goal}</p>
      {children}
    </section>
  );
}

function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={`inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-4 text-left font-semibold ring-1 transition ${on ? "bg-tide-600 text-white ring-tide-600" : "bg-white text-abyss ring-abyss/20 hover:bg-harbor-50"}`}>
      <span className={`grid h-6 w-6 place-items-center rounded-md ${on ? "bg-white text-tide-600" : "ring-1 ring-abyss/30"}`} aria-hidden="true">{on && <Icon name="check" className="h-4 w-4" />}</span>
      {children}
    </button>
  );
}
