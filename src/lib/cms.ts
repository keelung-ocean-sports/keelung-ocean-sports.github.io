import "server-only";
import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { tables, type TableKey } from "./schema";
import type {
  Activity,
  ActivityBlock,
  FeedbackRow,
  Kpi,
  LinkRow,
  Media,
  Milestone,
  Notice,
  Setting,
  Story,
  YearRow,
} from "./schema";

/** 內容來源：設定 GOOGLE_SHEET_ID 時讀 Google 試算表；失敗或未設定時用 content/seed 內建資料。 */
export type Source = "google-sheet" | "seed";

export type Issue = {
  table: string;
  row?: number; // 試算表列號（含標題列，從 1 起算）
  id?: string;
  level: "error" | "warning";
  message: string;
};

const REVALIDATE = Number(process.env.CONTENT_REVALIDATE_SECONDS || 300);
export const PREVIEW_MODE = process.env.SITE_PREVIEW_MODE === "true";

/** 不允許出現在公開內容表的欄位（防止誤把含個資的報名主表接上網站）。 */
const FORBIDDEN_HEADERS = /身分證|身份證|證號|生日|出生|緊急聯絡|保險|保單|血氧|心率|SpO|健康狀況|病史|住址|手機/;
/** 疑似個資的值：台灣身分證字號、手機號碼。 */
const ID_PATTERN = /\b[A-Z][12489]\d{8}\b/;
const MOBILE_PATTERN = /\b09\d{2}[-\s]?\d{3}[-\s]?\d{3}\b/;

async function readSeed(tab: string): Promise<string> {
  return fs.readFile(path.join(process.cwd(), "content", "seed", `${tab}.csv`), "utf8");
}

async function readSheet(sheetId: string, tab: string): Promise<string> {
  // CMS_SHEET_URL_TEMPLATE 僅供測試或改用其他 CSV 來源，例如 http://localhost:4000/{tab}.csv
  const template = process.env.CMS_SHEET_URL_TEMPLATE;
  const url = template
    ? template.replace("{tab}", encodeURIComponent(tab))
    : `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE, tags: ["cms"] } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.text();
  if (/^\s*</.test(body)) throw new Error("回傳的不是 CSV（試算表可能未開放「知道連結的人可檢視」）");
  return body;
}

type Loaded<T> = { rows: T[]; issues: Issue[]; source: Source };

async function loadTable<K extends TableKey>(key: K): Promise<Loaded<any>> {
  const t = tables[key];
  const issues: Issue[] = [];
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim() || (process.env.CMS_SHEET_URL_TEMPLATE ? "template" : "");
  let csv: string | null = null;
  let source: Source = "seed";

  if (sheetId) {
    try {
      csv = await readSheet(sheetId, t.tab);
      source = "google-sheet";
    } catch (e) {
      issues.push({
        table: t.tab,
        level: "error",
        message: `無法讀取 Google 試算表分頁「${t.tab}」：${(e as Error).message}。本表暫用網站內建資料。`,
      });
    }
  }

  const parse = (text: string) =>
    Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), { header: true, skipEmptyLines: "greedy" });

  let parsed = csv ? parse(csv) : null;

  if (parsed) {
    const headers = parsed.meta.fields ?? [];
    const forbidden = headers.filter((h) => FORBIDDEN_HEADERS.test(h));
    const missing = Object.keys(t.columns).filter((c) => !headers.includes(c));
    if (forbidden.length) {
      issues.push({
        table: t.tab,
        level: "error",
        message: `分頁含不可公開的欄位（${forbidden.join("、")}），已拒絕讀取。請確認接上的是「網站公開內容管理表」，不是報名主表。`,
      });
      parsed = null;
      source = "seed";
    } else if (missing.length) {
      issues.push({
        table: t.tab,
        level: "error",
        message: `分頁缺少欄位：${missing.join("、")}。請勿修改或刪除標題列。本表暫用網站內建資料。`,
      });
      parsed = null;
      source = "seed";
    }
  }
  if (!parsed) parsed = parse(await readSeed(t.tab));

  const rows: any[] = [];
  const seen = new Set<string>();
  parsed.data.forEach((raw, i) => {
    const rowNo = i + 2;
    const mapped: Record<string, string> = {};
    for (const [zh, en] of Object.entries(t.columns)) mapped[en] = (raw[zh] ?? "").toString().trim();

    // 個資掃描：網站設定中標示「不公開」的值不在此限（它們本來就不會顯示）
    const privateSetting = key === "settings" && mapped.isPublic !== "是";
    if (!privateSetting) {
      const leak = Object.values(mapped).find((v) => ID_PATTERN.test(v) || MOBILE_PATTERN.test(v));
      if (leak) {
        issues.push({
          table: t.tab,
          row: rowNo,
          id: mapped[t.idKey],
          level: "error",
          message: "此列含疑似身分證字號或手機號碼，已自動隱藏。",
        });
        return;
      }
    }

    const result = t.schema.safeParse(mapped);
    if (!result.success) {
      issues.push({
        table: t.tab,
        row: rowNo,
        id: mapped[t.idKey],
        level: "error",
        message: result.error.issues.map((x) => x.message).join("；"),
      });
      return;
    }
    const id = String((result.data as Record<string, unknown>)[t.idKey]);
    if (seen.has(id) && key !== "activityBlocks" && key !== "milestones") {
      issues.push({ table: t.tab, row: rowNo, id, level: "warning", message: "ID 重複，只採用第一筆。" });
      return;
    }
    seen.add(id);
    rows.push(result.data);
  });

  return { rows, issues, source };
}

export type Content = {
  source: Source;
  issues: Issue[];
  settings: Record<string, string>;
  links: LinkRow[];
  years: YearRow[];
  milestones: Milestone[];
  activities: Activity[];
  activityBlocks: ActivityBlock[];
  stories: Story[];
  media: Media[];
  kpis: Kpi[];
  feedback: FeedbackRow[];
  notices: Notice[];
};

const published = <T extends { publish: string }>(rows: T[]) => rows.filter((r) => r.publish === "已發布");
const byOrder = <T extends { order?: string }>(a: T, b: T) => Number(a.order || 999) - Number(b.order || 999);

/** 讀取並整理所有內容。同一次請求只會讀一次。 */
export const getContent = cache(async (): Promise<Content> => {
  const keys = Object.keys(tables) as TableKey[];
  const loaded = await Promise.all(keys.map((k) => loadTable(k)));
  const get = (k: TableKey) => loaded[keys.indexOf(k)];

  const issues = loaded.flatMap((l) => l.issues);
  const source: Source = loaded.some((l) => l.source === "google-sheet") ? "google-sheet" : "seed";

  const settings: Record<string, string> = {};
  for (const s of get("settings").rows as Setting[]) {
    if (s.isPublic === "是") settings[s.key] = s.value;
  }

  const media = published(get("media").rows as Media[])
    .filter((m) => m.consent === "已授權" || (PREVIEW_MODE && m.consent === "待確認"))
    .sort(byOrder);

  const links = published(get("links").rows as LinkRow[]).filter((l) => {
    if (l.confirm !== "已確認" || !l.url) return false;
    if (l.isResponderUrl === "是" && /\/edit|\/spreadsheets\//.test(l.url)) {
      issues.push({
        table: "公開連結",
        id: l.id,
        level: "error",
        message: "標示為填答網址，但網址是表單或試算表的「編輯／管理」網址，已隱藏。請改用「傳送」取得的填答網址。",
      });
      return false;
    }
    return true;
  });

  const activities = (get("activities").rows as Activity[]).filter((a) => a.publish === "已發布");
  for (const a of activities) {
    if (a.formUrl && /\/edit|\/spreadsheets\//.test(a.formUrl)) {
      issues.push({
        table: "活動管理",
        id: a.id,
        level: "error",
        message: "報名表單網址是「編輯／管理」網址，報名按鈕已隱藏。請改用表單的填答網址。",
      });
      a.formUrl = "";
    }
    if (a.status === "開放報名" && !a.formUrl) {
      issues.push({ table: "活動管理", id: a.id, level: "warning", message: "活動狀態為「開放報名」但未填報名表單網址，網站改顯示官方LINE聯繫。" });
    }
  }

  const activityIds = new Set(activities.map((a) => a.id));
  const stories = published(get("stories").rows as Story[]).filter((s) => {
    if (!activityIds.has(s.activityId)) {
      issues.push({ table: "活動故事", id: s.id, level: "error", message: `連結的活動ID「${s.activityId}」不存在或未發布，故事已隱藏。` });
      return false;
    }
    return true;
  });

  const content: Content = {
    source,
    issues,
    settings,
    links,
    years: published(get("years").rows as YearRow[]),
    milestones: published(get("milestones").rows as Milestone[]).sort((a, b) => a.date.localeCompare(b.date)),
    activities: activities.sort((a, b) => a.date.localeCompare(b.date)),
    activityBlocks: published(get("activityBlocks").rows as ActivityBlock[]).sort(byOrder),
    stories: stories.sort((a, b) => a.date.localeCompare(b.date)),
    media,
    kpis: published(get("kpis").rows as Kpi[]).sort(byOrder),
    feedback: published(get("feedback").rows as FeedbackRow[]).sort(byOrder),
    notices: published(get("notices").rows as Notice[]),
  };
  return content;
});

/** 檢核頁使用：回傳所有問題（不含任何草稿內容）。 */
export async function getIssues() {
  const c = await getContent();
  return { source: c.source, issues: c.issues };
}
