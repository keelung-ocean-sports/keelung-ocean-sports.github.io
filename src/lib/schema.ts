import { z } from "zod";

/**
 * 內容資料表定義。
 * 每張表對應 Google 試算表的一個分頁（分頁名稱＝ tab），欄位為中文標題。
 * 這裡把中文欄位對應成程式內部使用的英文鍵，並定義必填與格式檢核。
 */

export const PUBLISH_STATES = ["草稿", "待審核", "已發布", "已封存"] as const;
export const ACTIVITY_STATUSES = [
  "規劃中",
  "開放報名",
  "額滿",
  "候補",
  "報名截止",
  "場地調整",
  "延期",
  "取消",
  "已完成",
] as const;
export const ACTIVITY_TYPES = [
  "SUP入門體驗",
  "SUP常態訓練",
  "浮潛親海體驗",
  "親子海洋運動",
  "共融及適應性海洋活動",
  "水域安全教育",
  "進階訓練及自由潛水銜接",
  "青年志工、助教及專業培訓",
  "趣味競賽及成果分享",
] as const;
export const NOTICE_TYPES = ["一般", "正常辦理", "調整場地", "延期", "取消"] as const;
export const CONSENT_STATES = ["已授權", "待確認", "不公開"] as const;
export const KPI_CONFIRM = ["已列報", "協會確認達標", "待補佐證", "待確認", "未達成"] as const;
export const IMPROVE_STATES = ["規劃中", "執行中", "已完成", "暫緩"] as const;

const text = z.string().trim();
const optional = text.default("");
const required = (label: string) => text.min(1, `「${label}」為必填`);
const isoDate = (label: string) =>
  text.regex(/^\d{4}-\d{2}-\d{2}$/, `「${label}」需為 YYYY-MM-DD（例如 2026-07-04）`);
const optionalIsoDate = (label: string) =>
  text.refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), `「${label}」需為 YYYY-MM-DD 或留白`);
const oneOf = <T extends readonly string[]>(label: string, values: T) =>
  text.refine((v): v is T[number] => (values as readonly string[]).includes(v), {
    message: `「${label}」只能填：${values.join("、")}`,
  });
const optionalUrl = (label: string) =>
  text.refine(
    (v) => v === "" || v.startsWith("/") || /^https:\/\/[^\s]+$/.test(v),
    `「${label}」需為 https:// 開頭網址或站內路徑`,
  );
const yesNo = (label: string) => text.refine((v) => ["是", "否", ""].includes(v), `「${label}」只能填 是／否`);

export type TableDef = {
  tab: string;
  columns: Record<string, string>; // 中文欄名 -> 內部鍵
  schema: z.ZodTypeAny;
  idKey: string;
};

function def<S extends z.ZodRawShape>(tab: string, columns: Record<string, keyof S & string>, shape: S, idKey: keyof S & string) {
  return { tab, columns, schema: z.object(shape), idKey } as const;
}

export const tables = {
  settings: def(
    "網站設定",
    { 設定鍵: "key", 設定值: "value", 是否公開: "isPublic", 說明: "note" },
    { key: required("設定鍵"), value: optional, isPublic: yesNo("是否公開"), note: optional },
    "key",
  ),
  links: def(
    "公開連結",
    {
      連結ID: "id",
      名稱: "name",
      用途: "purpose",
      網址: "url",
      年度: "year",
      是否為填答網址: "isResponderUrl",
      確認狀態: "confirm",
      發布狀態: "publish",
      備註: "note",
    },
    {
      id: required("連結ID"),
      name: required("名稱"),
      purpose: optional,
      url: optionalUrl("網址"),
      year: optional,
      isResponderUrl: yesNo("是否為填答網址"),
      confirm: oneOf("確認狀態", ["已確認", "待確認"] as const),
      publish: oneOf("發布狀態", PUBLISH_STATES),
      note: optional,
    },
    "id",
  ),
  years: def(
    "年度計畫",
    {
      年度: "year",
      計畫名稱: "name",
      所屬計畫: "program",
      執行單位: "executor",
      指導補助單位: "sponsor",
      補助單位Logo: "sponsorLogo",
      補助關係標示: "sponsorLabel",
      執行期間: "period",
      統計截止: "cutoff",
      主要場域: "venue",
      經費說明: "budget",
      合作單位: "partners",
      年度摘要: "summary",
      資料來源: "source",
      資料確認狀態: "dataStatus",
      公開授權說明: "privacyNote",
      發布狀態: "publish",
    },
    {
      year: text.regex(/^\d{3}$/, "「年度」需為民國年三位數，例如 115"),
      name: required("計畫名稱"),
      program: optional,
      executor: required("執行單位"),
      sponsor: optional,
      sponsorLogo: optionalUrl("補助單位Logo"),
      sponsorLabel: optional,
      period: optional,
      cutoff: optional,
      venue: optional,
      budget: optional,
      partners: optional,
      summary: optional,
      source: optional,
      dataStatus: optional,
      privacyNote: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "year",
  ),
  milestones: def(
    "年度歷程",
    {
      年度: "year",
      排序日期: "date",
      日期顯示: "dateLabel",
      階段: "stage",
      標題: "title",
      說明: "description",
      相關活動ID: "activityIds",
      資料來源: "source",
      發布狀態: "publish",
    },
    {
      year: required("年度"),
      date: isoDate("排序日期"),
      dateLabel: optional,
      stage: optional,
      title: required("標題"),
      description: optional,
      activityIds: optional,
      source: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "title",
  ),
  activities: def(
    "活動管理",
    {
      活動ID: "id",
      年度: "year",
      活動名稱: "name",
      活動類型: "types",
      活動日期: "date",
      開始時間: "startTime",
      結束時間: "endTime",
      時段說明: "slot",
      活動地點: "location",
      簡介: "intro",
      參與對象: "audience",
      名額: "capacity",
      費用: "fee",
      報名表單網址: "formUrl",
      活動狀態: "status",
      集合資訊: "meeting",
      裝備與行前須知: "gear",
      安全注意事項: "safety",
      異動公告類型: "noticeType",
      異動公告: "notice",
      照片資料夾: "photoFolder",
      參與人次: "headcount",
      活動成果: "result",
      相關故事ID: "storyId",
      封面照片ID: "coverId",
      公開狀態: "publish",
    },
    {
      id: text.regex(/^[A-Za-z0-9_-]+$/, "「活動ID」只能用英數字、- 或 _"),
      year: required("年度"),
      name: required("活動名稱"),
      types: text.refine(
        (v) => v.split("|").every((t) => (ACTIVITY_TYPES as readonly string[]).includes(t.trim())),
        { message: `「活動類型」可填多個，用 | 分隔，每個只能是：${ACTIVITY_TYPES.join("、")}` },
      ),
      date: isoDate("活動日期"),
      startTime: optional,
      endTime: optional,
      slot: optional,
      location: optional,
      intro: optional,
      audience: optional,
      capacity: optional,
      fee: optional,
      formUrl: optionalUrl("報名表單網址"),
      status: oneOf("活動狀態", ACTIVITY_STATUSES),
      meeting: optional,
      gear: optional,
      safety: optional,
      noticeType: text.refine((v) => v === "" || (NOTICE_TYPES as readonly string[]).includes(v), {
        message: `「異動公告類型」只能填：${NOTICE_TYPES.join("、")}`,
      }),
      notice: optional,
      photoFolder: optional,
      headcount: text.refine((v) => v === "" || /^\d+$/.test(v), "「參與人次」只能填整數或留白"),
      result: optional,
      storyId: optional,
      coverId: optional,
      publish: oneOf("公開狀態", PUBLISH_STATES),
    },
    "id",
  ),
  activityBlocks: def(
    "活動內容",
    { 活動ID: "activityId", 區塊類型: "kind", 標題: "title", 內容: "body", 排序: "order", 發布狀態: "publish" },
    {
      activityId: required("活動ID"),
      kind: required("區塊類型"),
      title: required("標題"),
      body: required("內容"),
      order: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "title",
  ),
  stories: def(
    "活動故事",
    {
      故事ID: "id",
      年度: "year",
      活動ID: "activityId",
      標題: "title",
      主題: "themes",
      活動日期: "date",
      摘要: "summary",
      內文: "body",
      封面照片ID: "coverId",
      照片ID清單: "photoIds",
      影片ID: "videoId",
      資料來源: "source",
      發布狀態: "publish",
    },
    {
      id: text.regex(/^[A-Za-z0-9_-]+$/, "「故事ID」只能用英數字、- 或 _"),
      year: required("年度"),
      activityId: required("活動ID（故事必須連結到實際活動）"),
      title: required("標題"),
      themes: optional,
      date: isoDate("活動日期"),
      summary: optional,
      body: required("內文"),
      coverId: optional,
      photoIds: optional,
      videoId: optional,
      source: required("資料來源"),
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "id",
  ),
  media: def(
    "照片與影片",
    {
      媒體ID: "id",
      年度: "year",
      活動ID: "activityId",
      類型: "kind",
      檔案路徑或網址: "src",
      替代文字: "alt",
      說明: "caption",
      拍攝日期: "date",
      主題: "theme",
      來源: "credit",
      原始資料夾: "folder",
      授權狀態: "consent",
      含未成年: "hasMinor",
      清晰正面人臉: "hasFace",
      用途: "usage",
      排序: "order",
      發布狀態: "publish",
    },
    {
      id: required("媒體ID"),
      year: required("年度"),
      activityId: optional,
      kind: oneOf("類型", ["照片", "影片"] as const),
      src: optionalUrl("檔案路徑或網址").refine((v) => v !== "", "「檔案路徑或網址」為必填"),
      alt: required("替代文字"),
      caption: optional,
      date: optionalIsoDate("拍攝日期"),
      theme: optional,
      credit: optional,
      folder: optional,
      consent: oneOf("授權狀態", CONSENT_STATES),
      hasMinor: text.refine((v) => ["是", "否", "待確認", ""].includes(v), "「含未成年」只能填 是／否／待確認"),
      hasFace: text.refine((v) => ["是", "否", "待確認", ""].includes(v), "「清晰正面人臉」只能填 是／否／待確認"),
      usage: optional,
      order: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "id",
  ),
  kpis: def(
    "年度KPI",
    {
      年度: "year",
      KPI_ID: "id",
      類別: "category",
      指標名稱: "name",
      目標值: "target",
      目標單位: "targetUnit",
      實績值: "actual",
      實績單位: "actualUnit",
      實績說明: "actualNote",
      統計期間: "period",
      計算方法: "method",
      執行方法: "execution",
      佐證來源: "evidence",
      確認狀態: "confirm",
      相關活動ID: "activityIds",
      相關照片ID: "photoIds",
      相關回饋: "feedback",
      備註: "note",
      排序: "order",
      發布狀態: "publish",
    },
    {
      year: required("年度"),
      id: required("KPI_ID"),
      category: oneOf("類別", ["核定KPI", "統計指標"] as const),
      name: required("指標名稱"),
      target: optional,
      targetUnit: optional,
      actual: optional,
      actualUnit: optional,
      actualNote: optional,
      period: optional,
      method: optional,
      execution: optional,
      evidence: optional,
      confirm: oneOf("確認狀態", KPI_CONFIRM),
      activityIds: optional,
      photoIds: optional,
      feedback: optional,
      note: optional,
      order: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "id",
  ),
  feedback: def(
    "回饋與改善",
    {
      年度: "year",
      項目ID: "id",
      類型: "kind",
      項目: "name",
      數值: "value",
      單位: "unit",
      有效份數: "base",
      比率: "ratio",
      說明: "note",
      問題類型: "issue",
      規劃改善方式: "plan",
      改善狀態: "status",
      佐證: "evidence",
      排序: "order",
      發布狀態: "publish",
    },
    {
      year: required("年度"),
      id: required("項目ID"),
      kind: oneOf("類型", ["滿意度題項", "學習成效", "海洋觀察", "安全測驗", "改善追蹤", "參與者心得"] as const),
      name: required("項目"),
      value: optional,
      unit: optional,
      base: optional,
      ratio: optional,
      note: optional,
      issue: optional,
      plan: optional,
      status: text.refine((v) => v === "" || (IMPROVE_STATES as readonly string[]).includes(v), {
        message: `「改善狀態」只能填：${IMPROVE_STATES.join("、")}`,
      }),
      evidence: optional,
      order: optional,
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "id",
  ),
  notices: def(
    "網站公告",
    {
      公告ID: "id",
      標題: "title",
      內容: "body",
      類型: "kind",
      相關活動ID: "activityId",
      開始顯示日期: "from",
      結束顯示日期: "to",
      置頂: "pinned",
      發布狀態: "publish",
    },
    {
      id: required("公告ID"),
      title: required("標題"),
      body: optional,
      kind: oneOf("類型", NOTICE_TYPES),
      activityId: optional,
      from: optionalIsoDate("開始顯示日期"),
      to: optionalIsoDate("結束顯示日期"),
      pinned: yesNo("置頂"),
      publish: oneOf("發布狀態", PUBLISH_STATES),
    },
    "id",
  ),
} as const;

export type TableKey = keyof typeof tables;
type Row<K extends TableKey> = z.infer<(typeof tables)[K]["schema"]>;

export type Setting = Row<"settings">;
export type LinkRow = Row<"links">;
export type YearRow = Row<"years">;
export type Milestone = Row<"milestones">;
export type Activity = Row<"activities">;
export type ActivityBlock = Row<"activityBlocks">;
export type Story = Row<"stories">;
export type Media = Row<"media">;
export type Kpi = Row<"kpis">;
export type FeedbackRow = Row<"feedback">;
export type Notice = Row<"notices">;
