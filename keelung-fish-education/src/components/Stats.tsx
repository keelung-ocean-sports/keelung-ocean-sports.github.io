import { CountUp } from "./CountUp";

export type Stat = { value: string; unit: string; label: string; note?: string };

export function Stats({ items, dark = false }: { items: Stat[]; dark?: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((s) => {
        const n = Number(s.value);
        return (
          <div key={s.label} className={`rounded-2xl p-5 ${dark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-harbor-50 ring-1 ring-harbor-100"}`}>
            <dt className={`text-sm font-semibold ${dark ? "text-tide-100" : "text-tide-600"}`}>{s.label}</dt>
            <dd className="mt-1">
              <span className={`text-4xl font-black tabular-nums ${dark ? "text-white" : "text-abyss"}`}>
                {Number.isFinite(n) ? <><CountUp value={n} /><span className="sr-only">{s.value}</span></> : s.value}
              </span>
              <span className="ml-1 text-base font-bold">{s.unit}</span>
              {s.note && <span className={`mt-1 block text-xs leading-5 ${dark ? "text-white/75" : "text-ink-soft"}`}>{s.note}</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
