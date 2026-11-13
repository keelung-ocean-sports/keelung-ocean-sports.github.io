export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://keelung-ocean-sports.github.io") + (process.env.NEXT_PUBLIC_BASE_PATH || "");
export const SITE_NAME = "潮境共學｜基隆食魚教育";

export const STOPS = {
  market: { name: "八斗子市場", short: "市場", verb: "看見魚貨", mission: "海鮮偵探任務", n: 1 },
  harbor: { name: "八斗子漁港", short: "漁港", verb: "理解漁法", mission: "漁人的秘密工具箱", n: 2 },
  tide: { name: "潮間帶", short: "潮間帶", verb: "認識海岸", mission: "潮間帶生態密室", n: 3 },
  table: { name: "海味餐桌", short: "餐桌", verb: "完成料理", mission: "海味餐桌共創工坊", n: 4 },
} as const;
export type StopKey = keyof typeof STOPS;

export const NAV = [
  { href: "/journey/", label: "學習路徑" },
  { href: "/species/", label: "海味圖鑑" },
  { href: "/fishing-methods/", label: "漁法圖鑑" },
  { href: "/activities/", label: "活動" },
  { href: "/missions/", label: "親子任務" },
  { href: "/materials/", label: "教材中心" },
  { href: "/results/115/", label: "115成果館" },
];
export const MORE = [
  { href: "/stories/", label: "活動故事" },
  { href: "/inclusive/", label: "共融食魚教育" },
  { href: "/partners/", label: "合作夥伴" },
  { href: "/about/", label: "關於潮境共學" },
];

export function fmtDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return `${y - 1911}年${m}月${day}日`;
}
export function shortDate(d: string) {
  const [, m, day] = d.split("-").map(Number);
  return `${m}/${day}`;
}
