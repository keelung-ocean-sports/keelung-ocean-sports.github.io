import Link from "next/link";
import type { Activity, Content, Story } from "@/lib/cms-types";
import { STATUS_STYLE, TYPE_SHORT, formatDate, mediaMap, registrationOpen, splitList } from "@/lib/view";
import { Icon } from "./Icon";
import { Photo } from "./Photo";

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { label: status, className: "bg-slate-100 text-slate-700 ring-slate-300" };
  return <span className={`chip ${s.className}`}>{s.label}</span>;
}

export function TypeChips({ types }: { types: string }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {splitList(types).map((t) => (
        <span key={t} className="rounded-full bg-shallow/40 px-2.5 py-0.5 text-[13px] font-semibold text-deep">{TYPE_SHORT[t] ?? t}</span>
      ))}
    </span>
  );
}

export function ActivityCard({ a, c }: { a: Activity; c: Content }) {
  const d = formatDate(a.date);
  const cover = a.coverId ? mediaMap(c).get(a.coverId) : undefined;
  const past = a.status === "已完成";
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/activities/${a.id}`} className="flex flex-1 flex-col focus-visible:outline-offset-[-3px]">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-deep to-teal">
          {cover ? (
            <Photo m={cover} className="absolute inset-0" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/30"><Icon name="wave" className="h-16 w-16" /></div>
          )}
          <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 text-center leading-tight shadow">
            <span className="block text-[11px] font-bold text-teal">{d.roc.slice(0, 3)}年</span>
            <span className="block text-lg font-black text-deep">{d.md}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={a.status} />
            {past ? <span className="text-[13px] font-semibold text-ink-soft">{a.year}年度活動回顧</span> : null}
          </div>
          <h3 className="text-xl font-bold group-hover:text-teal">{a.name}</h3>
          <TypeChips types={a.types} />
          <p className="flex items-start gap-1.5 text-[15px] text-ink-soft">
            <Icon name="pin" className="mt-1 h-4 w-4 shrink-0" />
            {a.location || "地點依主辦單位公告"}｜{a.slot || [a.startTime, a.endTime].filter(Boolean).join("–") || "時間依公告"}
          </p>
          {a.noticeType && a.noticeType !== "正常辦理" && a.notice ? (
            <p className="rounded-lg bg-amber-50 p-2 text-sm font-semibold text-amber-900">異動：{a.notice}</p>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 font-bold text-teal">
            {registrationOpen(a) ? "查看並報名" : past ? "看活動紀錄" : "活動詳情"}
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function StoryCard({ s, c }: { s: Story; c: Content }) {
  const cover = s.coverId ? mediaMap(c).get(s.coverId) : undefined;
  const d = formatDate(s.date);
  return (
    <article className="card group overflow-hidden">
      <Link href={`/stories/${s.id}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-teal to-deep">
          {cover ? <Photo m={cover} className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" /> : null}
        </div>
        <div className="p-5">
          <p className="text-sm font-bold text-teal">{d.full}</p>
          <h3 className="mt-1 text-xl font-bold group-hover:text-teal">{s.title}</h3>
          {s.summary ? <p className="mt-2 text-[15px] text-ink-soft">{s.summary}</p> : null}
        </div>
      </Link>
    </article>
  );
}
