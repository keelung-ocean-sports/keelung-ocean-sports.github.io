/**
 * 內容檢核：建置前在 GitHub Actions 執行，結果寫進該次執行的 Summary。
 * 檢查：試算表是否讀得到、欄位錯誤、個資疑慮、照片代號是否存在、各場人數加總是否等於成果館的實際參與人次。
 */
import { appendFileSync } from "fs";
import { getActivities, getPhotos, getResults, getSpecies, getMethods, getStories, issues } from "../src/lib/content";

(async () => {
  const acts = await getActivities();
  const photos = new Set((await getPhotos()).map((p) => p.id));
  const extra: string[] = [];
  const check = (where: string, ref: string) => { if (ref && !/^https?:/.test(ref) && !photos.has(ref)) extra.push(`${where}：找不到照片代號「${ref}」`); };
  acts.forEach((a) => { check(`活動 ${a.slug}`, a.coverImage); a.gallery.forEach((g) => check(`活動 ${a.slug}`, g)); });
  (await getStories()).forEach((s) => check(`故事 ${s.slug}`, s.coverImage));
  (await getSpecies()).forEach((s) => check(`魚種 ${s.slug}`, s.coverImage));
  (await getMethods()).forEach((m) => check(`漁法 ${m.slug}`, m.coverImage));
  for (const y of new Set(acts.map((a) => a.year))) {
    const sum = acts.filter((a) => a.year === y).reduce((t, a) => t + (a.participants ?? 0), 0);
    const r = (await getResults(y)).find((x) => x.metric === "participants");
    if (r && Number(r.value) !== sum) extra.push(`${y}年度：成果表實際參與 ${r.value} 與各場加總 ${sum} 不一致，成果館會停止顯示該數字`);
  }
  const src = process.env.FISH_SHEET_ID ? "Google 試算表" : "內建資料（content/seed）";
  const lines = [`## 食魚教育網站內容檢核`, `資料來源：${src}`, `活動 ${acts.length} 場`, "", ...issues.map((i) => `- ❌ [${i.table}${i.row ? ` 第${i.row}列` : ""}] ${i.message}`), ...extra.map((x) => `- ⚠️ ${x}`)];
  if (!issues.length && !extra.length) lines.push("- ✅ 沒有發現問題");
  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
})();
