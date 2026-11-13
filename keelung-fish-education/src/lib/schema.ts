import { z } from "zod";

/** 試算表欄位規則。每個分頁對應一張表，欄位名稱必須和 content/seed/*.csv 的標題列一致。 */
const bool = z.string().transform((v) => /^(true|是|1|y|yes)$/i.test(v.trim()));
const list = z.string().transform((v) =>
  v.split("|").map((x) => x.trim()).filter(Boolean),
);
const num = z.string().transform((v) => (v.trim() === "" ? null : Number(v.replace(/,/g, ""))));
const order = z.string().transform((v) => Number(v) || 999);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式需為 YYYY-MM-DD");
const slug = z.string().regex(/^[a-z0-9-]+$/, "代稱只能用小寫英文、數字和 -");

export const activitySchema = z.object({
  id: z.string().min(1),
  slug,
  year: z.string().min(1),
  date,
  title: z.string().min(1, "缺少活動名稱"),
  type: z.string().min(1),
  location: z.string(),
  participants: num,
  summary: z.string(),
  content: z.string(),
  stops: list,
  status: z.string(),
  coverImage: z.string(),
  gallery: list,
  storySlug: z.string(),
  materialSlug: z.string(),
  featured: bool,
  published: bool,
  order,
});

export const storySchema = z.object({
  id: z.string().min(1),
  slug,
  title: z.string().min(1),
  date,
  activitySlug: z.string(),
  summary: z.string(),
  content: z.string(),
  coverImage: z.string(),
  gallery: list,
  published: bool,
  order,
});

export const speciesSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  localName: z.string(),
  category: z.string().min(1),
  scientificName: z.string(),
  season: z.string(),
  origin: z.string(),
  features: z.string(),
  freshnessTips: z.string(),
  cooking: z.string(),
  fishingMethods: list,
  sustainability: z.string(),
  marketTips: z.string(),
  kidsMission: z.string(),
  coverImage: z.string(),
  gallery: list,
  published: bool,
  order,
});

export const methodSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  description: z.string(),
  targetSpecies: list,
  gear: z.string(),
  howItWorks: z.string(),
  selectivity: z.string(),
  bycatch: z.string(),
  season: z.string(),
  localContext: z.string(),
  sustainabilityNotes: z.string(),
  kidsMission: z.string(),
  coverImage: z.string(),
  gallery: list,
  published: bool,
  order,
});

export const materialSchema = z.object({
  id: z.string().min(1),
  slug,
  title: z.string().min(1),
  audience: z.string(),
  category: z.string().min(1),
  description: z.string(),
  pdfUrl: z.string(),
  previewImage: z.string(),
  printSize: z.string(),
  pages: z.string(),
  version: z.string(),
  updatedAt: z.string(),
  published: bool,
  order,
});

export const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string(),
  logo: z.string(),
  website: z.string(),
  description: z.string(),
  published: bool,
  order,
});

export const resultSchema = z.object({
  year: z.string().min(1),
  metric: z.string().min(1),
  label: z.string().min(1),
  value: z.string(),
  unit: z.string(),
  target: z.string(),
  description: z.string(),
  published: bool,
  order,
});

export const photoSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().min(1, "照片需要替代文字（alt）"),
  caption: z.string(),
  activitySlug: z.string(),
  stop: z.string(),
  featured: bool,
  published: bool,
  order,
});

export const settingSchema = z.object({ key: z.string().min(1), value: z.string() });

export const tables = {
  activities: { tab: "activities", schema: activitySchema },
  stories: { tab: "stories", schema: storySchema },
  species: { tab: "species", schema: speciesSchema },
  fishingMethods: { tab: "fishing_methods", schema: methodSchema },
  materials: { tab: "materials", schema: materialSchema },
  partners: { tab: "partners", schema: partnerSchema },
  results: { tab: "results", schema: resultSchema },
  photos: { tab: "photos", schema: photoSchema },
  settings: { tab: "site_settings", schema: settingSchema },
} as const;

export type TableKey = keyof typeof tables;
export type Activity = z.output<typeof activitySchema>;
export type Story = z.output<typeof storySchema>;
export type Species = z.output<typeof speciesSchema>;
export type FishingMethod = z.output<typeof methodSchema>;
export type Material = z.output<typeof materialSchema>;
export type Partner = z.output<typeof partnerSchema>;
export type Result = z.output<typeof resultSchema>;
export type Photo = z.output<typeof photoSchema>;
