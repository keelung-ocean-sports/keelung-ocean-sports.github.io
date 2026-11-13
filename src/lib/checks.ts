import { PREVIEW_MODE, type Content } from "./cms";
import { splitList } from "./view";

/** 數據一致性檢核（/cms-check 頁面與靜態版建置報告共用）。 */
export function consistencyChecks(c: Content) {
  const checks: { ok: boolean; text: string }[] = [];

  for (const y of c.years) {
    const acts = c.activities.filter((a) => a.year === y.year && a.headcount);
    const sum = acts.reduce((s, a) => s + Number(a.headcount), 0);
    const s01 = c.kpis.find((k) => k.year === y.year && k.id === "S01");
    const s02 = c.kpis.find((k) => k.year === y.year && k.id === "S02");
    const k01 = c.kpis.find((k) => k.year === y.year && k.id === "K01");
    if (s01) checks.push({ ok: Number(s01.actual) === sum, text: `${y.year}年度：活動管理「參與人次」加總 ${sum}，年度KPI「實體活動名冊」${s01.actual}` });
    const k10 = c.kpis.find((k) => k.year === y.year && k.id === "K10");
    const s03 = c.kpis.find((k) => k.year === y.year && k.id === "S03");
    if (s01 && s02 && k10 && s03 && k01) {
      const total = Number(s01.actual) + Number(s02.actual) + Number(k10.actual) + Number(s03.actual);
      checks.push({ ok: total === Number(k01.actual), text: `${y.year}年度：投保 ${s01.actual} ＋ 安全教育 ${s02.actual} ＋ 體適能 ${k10.actual} ＋ 活動後回饋 ${s03.actual} ＝ ${total}，年度推廣與參與填 ${k01.actual}` });
    }
    const coreK = c.kpis.filter((k) => k.year === y.year && k.category === "核定KPI");
    const assoc = coreK.filter((k) => k.confirm === "協會確認達標");
    const unconfirmed = coreK.filter((k) => k.confirm !== "已列報" && k.confirm !== "協會確認達標");
    if (assoc.length) checks.push({ ok: true, text: `${y.year}年度：${assoc.length} 項核定KPI為「協會確認達標」（${assoc.map((k) => k.name).join("、")}），公開頁顯示達標、不顯示人數` });
    if (unconfirmed.length) checks.push({ ok: false, text: `${y.year}年度：${unconfirmed.length} 項核定KPI尚未列報（${unconfirmed.map((k) => k.name).join("、")}），公開頁只顯示目標` });
  }
  const pendingMedia = c.media.filter((m) => m.consent !== "已授權").length;
  checks.push({ ok: pendingMedia === 0, text: `目前顯示中的照片有 ${pendingMedia} 張肖像授權為「待確認」${PREVIEW_MODE ? "（預覽模式才會顯示）" : ""}` });
  const storyMissing = c.stories.flatMap((s) => splitList(s.photoIds).filter((id) => !c.media.some((m) => m.id === id)).map((id) => `${s.id}→${id}`));
  if (storyMissing.length) checks.push({ ok: false, text: `故事引用的照片未公開或不存在：${storyMissing.slice(0, 10).join("、")}${storyMissing.length > 10 ? "…" : ""}` });

  return checks;
}
