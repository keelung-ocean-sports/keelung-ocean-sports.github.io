import Link from "next/link";
import { STOPS, type StopKey } from "@/lib/site";
import { Icon } from "./Icon";

/** 市場 → 漁港 → 潮間帶 → 餐桌 四站。highlight 標示某活動實際走過的站。 */
export function JourneyStrip({ highlight, dark = false, linkTo = "/journey/" }: { highlight?: StopKey[]; dark?: boolean; linkTo?: string | null }) {
  const keys = Object.keys(STOPS) as StopKey[];
  return (
    <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {keys.map((k) => {
        const s = STOPS[k];
        const on = !highlight || highlight.includes(k);
        const inner = (
          <>
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${on ? "bg-coral-600 text-white" : dark ? "bg-white/10 text-white/50" : "bg-harbor-100 text-harbor-600/50"}`}><Icon name={k} /></span>
            <span>
              <span className={`block text-xs font-bold tracking-widest ${dark ? "text-tide-100" : "text-tide-600"}`}>STOP {s.n}</span>
              <span className={`block text-lg font-bold ${dark ? "text-white" : "text-abyss"}`}>{s.short}</span>
              <span className={`block text-sm ${dark ? "text-white/80" : "text-ink-soft"}`}>{s.verb}</span>
            </span>
            {highlight && <span className="sr-only">{on ? "（本場有安排）" : "（本場未安排）"}</span>}
          </>
        );
        const cls = `flex min-h-[88px] items-center gap-3 rounded-2xl p-4 no-underline ${dark ? "bg-white/5 ring-1 ring-white/15" : "bg-white ring-1 ring-abyss/10"} ${on ? "" : "opacity-60"}`;
        return (
          <li key={k}>
            {linkTo ? <Link href={`${linkTo}#${k}`} className={`${cls} hover:ring-coral-500`}>{inner}</Link> : <div className={cls}>{inner}</div>}
          </li>
        );
      })}
    </ol>
  );
}
