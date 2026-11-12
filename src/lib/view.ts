import type { Activity, Content, Media, Notice } from "./cms-types";

export const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 2026-07-04 -> { roc: "115/07/04", md: "7月4日", weekday: "六" } */
export function formatDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { roc: iso, md: iso, weekday: "", full: iso };
  const [y, m, d] = iso.split("-").map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const roc = `${y - 1911}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
  return { roc, md: `${m}月${d}日`, weekday: wd, full: `${y - 1911}年${m}月${d}日（${wd}）` };
}

/** 台灣時間的今天 YYYY-MM-DD */
export function todayTaipei() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
}

export const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  規劃中: { label: "規劃中", className: "bg-slate-100 text-slate-700 ring-slate-300" },
  開放報名: { label: "開放報名", className: "bg-emerald-50 text-emerald-800 ring-emerald-300" },
  額滿: { label: "額滿", className: "bg-rose-50 text-rose-800 ring-rose-300" },
  候補: { label: "開放候補", className: "bg-amber-50 text-amber-800 ring-amber-300" },
  報名截止: { label: "報名截止", className: "bg-slate-100 text-slate-700 ring-slate-300" },
  場地調整: { label: "場地調整", className: "bg-amber-50 text-amber-900 ring-amber-400" },
  延期: { label: "延期", className: "bg-orange-50 text-orange-900 ring-orange-400" },
  取消: { label: "取消", className: "bg-rose-50 text-rose-900 ring-rose-400" },
  已完成: { label: "已完成", className: "bg-teal-100 text-deep ring-teal-500/40" },
};

export const TYPE_SHORT: Record<string, string> = {
  SUP入門體驗: "SUP",
  SUP常態訓練: "SUP 訓練",
  浮潛親海體驗: "浮潛",
  親子海洋運動: "親子",
  共融及適應性海洋活動: "共融",
  水域安全教育: "水域安全",
  進階訓練及自由潛水銜接: "進階訓練",
  "青年志工、助教及專業培訓": "專業培訓",
  趣味競賽及成果分享: "趣味競賽",
};

export const splitList = (v: string) =>
  v
    .split(/[|｜]/)
    .map((s) => s.trim())
    .filter(Boolean);

export function mediaMap(c: Content) {
  return new Map(c.media.map((m) => [m.id, m] as const));
}

export function pickMedia(c: Content, ids: string[]): Media[] {
  const map = mediaMap(c);
  return ids.map((id) => map.get(id)).filter((m): m is Media => Boolean(m));
}

export function mediaByUsage(c: Content, usage: string) {
  return c.media.filter((m) => splitList(m.usage).includes(usage) && m.kind === "照片");
}

export function link(c: Content, id: string) {
  return c.links.find((l) => l.id === id);
}

export function lineUrl(c: Content) {
  return link(c, "line_official")?.url;
}

export function isUpcoming(a: Activity, today = todayTaipei()) {
  return a.date >= today && a.status !== "已完成";
}

export function activeNotices(c: Content, today = todayTaipei()): Notice[] {
  return c.notices
    .filter((n) => (!n.from || n.from <= today) && (!n.to || n.to >= today))
    .sort((a, b) => Number(b.pinned === "是") - Number(a.pinned === "是"));
}

export function yearRow(c: Content, year: string) {
  return c.years.find((y) => y.year === year);
}

export function parsePartners(v: string) {
  return v
    .split(/[；;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [kind, ...rest] = s.split(/[:：]/);
      return rest.length ? { kind: kind.trim(), name: rest.join(":").trim() } : { kind: "", name: kind.trim() };
    });
}

export function registrationOpen(a: Activity) {
  return (a.status === "開放報名" || a.status === "候補") && /^https:\/\//.test(a.formUrl);
}

/** 達成率（目標與實績都是純數字時才計算） */
export function achievement(target: string, actual: string): string | null {
  const t = Number(target), a = Number(actual);
  if (!target || !actual || !isFinite(t) || !isFinite(a) || t <= 0) return null;
  return `${((a / t) * 100).toFixed(1)}%`;
}
