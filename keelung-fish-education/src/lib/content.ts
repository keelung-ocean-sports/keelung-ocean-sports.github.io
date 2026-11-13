import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { cache } from "react";
import { tables, type TableKey, type Activity, type Story, type Species, type FishingMethod, type Material, type Partner, type Result, type Photo } from "./schema";

/**
 * 內容來源（建置時讀取，GitHub Pages 靜態輸出）：
 * - 設定 FISH_SHEET_ID：讀 Google 試算表（需「知道連結的任何人可檢視」）。
 * - 未設定或讀取失敗：使用 content/seed/*.csv 內建資料，網站照常運作。
 */
export type Issue = { table: string; row?: number; level: "error" | "warning"; message: string };
export const issues: Issue[] = [];

/** 公開內容表不得出現的欄位：避免把報名／保險名冊誤接上網站。 */
const FORBIDDEN = /姓名|身分證|身份證|生日|出生|電話|手機|email|e-mail|地址|住址|保險|保單|健康|病史|障別|障礙類別|特殊需求|緊急聯絡|監護/i;
const ID_PATTERN = /\b[A-Z][12489]\d{8}\b/;
const MOBILE_PATTERN = /\b09\d{2}[-\s]?\d{3}[-\s]?\d{3}\b/;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/;

async function fetchSheet(tab: string): Promise<string> {
  const id = process.env.FISH_SHEET_ID?.trim();
  if (!id) throw new Error("no-sheet");
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.text();
  if (/^\s*</.test(body)) throw new Error("回傳的不是 CSV，試算表可能沒有開放檢視");
  return body;
}

function parse(text: string) {
  return Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), { header: true, skipEmptyLines: "greedy" });
}

async function load<K extends TableKey>(key: K): Promise<any[]> {
  const t = tables[key];
  const shape = Object.keys((t.schema as any).shape);
  let parsed: ReturnType<typeof parse> | null = null;
  if (process.env.FISH_SHEET_ID?.trim()) {
    try {
      const p = parse(await fetchSheet(t.tab));
      const headers = p.meta.fields ?? [];
      const forbidden = headers.filter((h) => FORBIDDEN.test(h));
      const missing = shape.filter((c) => !headers.includes(c));
      if (forbidden.length) issues.push({ table: t.tab, level: "error", message: `含不可公開欄位（${forbidden.join("、")}），已改用內建資料。` });
      else if (missing.length) issues.push({ table: t.tab, level: "error", message: `缺少欄位：${missing.join("、")}，已改用內建資料。` });
      else parsed = p;
    } catch (e) {
      issues.push({ table: t.tab, level: "error", message: `無法讀取試算表：${(e as Error).message}，已改用內建資料。` });
    }
  }
  if (!parsed) parsed = parse(await fs.readFile(path.join(process.cwd(), "content", "seed", `${t.tab}.csv`), "utf8"));

  const rows: any[] = [];
  parsed.data.forEach((raw, i) => {
    const rec: Record<string, string> = {};
    for (const c of shape) rec[c] = String(raw[c] ?? "").trim();
    if (key !== "settings" && Object.values(rec).some((v) => ID_PATTERN.test(v) || MOBILE_PATTERN.test(v) || EMAIL_PATTERN.test(v))) {
      issues.push({ table: t.tab, row: i + 2, level: "error", message: "此列含疑似個資（身分證、手機或 Email），已隱藏。" });
      return;
    }
    const r = t.schema.safeParse(rec);
    if (!r.success) {
      issues.push({ table: t.tab, row: i + 2, level: "error", message: r.error.issues.map((x) => `${x.path.join(".")}：${x.message}`).join("；") });
      return;
    }
    rows.push(r.data);
  });
  return rows;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
const pub = <T extends { published: boolean; order: number }>(xs: T[]) => xs.filter((x) => x.published).sort(byOrder);

export const getActivities = cache(async (): Promise<Activity[]> => pub(await load("activities")).sort((a: Activity, b: Activity) => a.date.localeCompare(b.date)));
export const getStories = cache(async (): Promise<Story[]> => pub(await load("stories")));
export const getSpecies = cache(async (): Promise<Species[]> => pub(await load("species")));
export const getMethods = cache(async (): Promise<FishingMethod[]> => pub(await load("fishingMethods")));
export const getMaterials = cache(async (): Promise<Material[]> => pub(await load("materials")));
export const getPartners = cache(async (): Promise<Partner[]> => pub(await load("partners")));
export const getResults = cache(async (year?: string): Promise<Result[]> => pub(await load("results")).filter((r: Result) => !year || r.year === year));
export const getPhotos = cache(async (): Promise<Photo[]> => pub(await load("photos")));
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = (await load("settings")) as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
});
export const getYears = cache(async (): Promise<string[]> => {
  const ys = new Set((await getResults()).map((r) => r.year));
  (await getActivities()).forEach((a) => ys.add(a.year));
  return [...ys].sort();
});

/** 照片：以代號（photos 表的 id）或完整網址指定。 */
export type Img = { src: string; srcSet?: string; alt: string; caption?: string; id: string };
export const resolveImage = cache(async (ref: string, fallbackAlt = ""): Promise<Img | null> => {
  if (!ref) return null;
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (/^https?:\/\//.test(ref)) return { id: ref, src: ref, alt: fallbackAlt };
  const p = (await getPhotos()).find((x) => x.id === ref);
  const file = p?.src || ref;
  if (/^https?:\/\//.test(file)) return { id: ref, src: file, alt: p?.alt || fallbackAlt, caption: p?.caption };
  if (!p) {
    if (process.env.NODE_ENV !== "production") console.warn(`[content] 找不到照片代號：${ref}`);
    return null;
  }
  return {
    id: ref,
    src: `${bp}/media/${file}-1600.webp`,
    srcSet: `${bp}/media/${file}-800.webp 800w, ${bp}/media/${file}-1600.webp 1600w`,
    alt: p.alt,
    caption: p.caption,
  };
});
export async function resolveImages(refs: string[]) {
  return (await Promise.all(refs.map((r) => resolveImage(r)))).filter(Boolean) as Img[];
}
export async function photosFor(filter: (p: Photo) => boolean) {
  return resolveImages((await getPhotos()).filter(filter).map((p) => p.id));
}
export function asset(p: string) {
  if (!p || /^https?:\/\//.test(p)) return p;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}`;
}

export async function activityCards(list?: Activity[]) {
  const acts = list ?? (await getActivities());
  return Promise.all(acts.map(async (a) => ({
    slug: a.slug, date: a.date, title: a.title, type: a.type, participants: a.participants, summary: a.summary, location: a.location, year: a.year,
    img: await resolveImage(a.coverImage, a.title),
  })));
}
