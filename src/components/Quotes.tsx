import type { FeedbackRow as Feedback } from "@/lib/schema";

/** 參與者心得（取自活動後回饋開放題，填答者勾選同意公開，已去識別）。 */
export function Quotes({ items, dark = false }: { items: Feedback[]; dark?: boolean }) {
  if (!items.length) return null;
  return (
    <figure>
      <ul className={`grid gap-4 ${items.length > 2 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : ""}`}>
        {items.map((q) => (
          <li key={q.id} className={`relative rounded-3xl p-6 pt-10 ${dark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-white ring-1 ring-deep/10"}`}>
            <span aria-hidden className={`absolute left-5 top-1 font-serif text-6xl leading-none ${dark ? "text-sand/70" : "text-teal/30"}`}>“</span>
            <blockquote className={`text-[17px] font-semibold leading-8 ${dark ? "" : "text-deep"}`}>{q.name}</blockquote>
            <p className={`mt-3 text-sm ${dark ? "text-shallow" : "text-ink-soft"}`}>— {q.note}回饋</p>
          </li>
        ))}
      </ul>
      <figcaption className={`mt-3 text-xs ${dark ? "text-white/60" : "text-ink-soft"}`}>取自活動後回饋表單開放題，填答者勾選同意公開，已去識別。</figcaption>
    </figure>
  );
}
