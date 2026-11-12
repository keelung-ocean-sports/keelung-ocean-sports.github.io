/**
 * 內容檢核報告（靜態網站版用，取代 /cms-check 頁面）。
 * 執行：npm run content-report
 * 在 GitHub Actions 中會同時寫進該次執行的「Summary」，協會人員可在 Actions 頁面查看。
 * 報告只列出列號、ID 與問題說明，不會輸出任何儲存格內容。
 */
import { appendFileSync } from "fs";
import { getContent } from "../src/lib/cms";
import { consistencyChecks } from "../src/lib/checks";

async function main() {
  const c = await getContent();
  const errors = c.issues.filter((i) => i.level === "error");
  const warnings = c.issues.filter((i) => i.level === "warning");

  const lines: string[] = [];
  lines.push("## 網站內容檢核");
  lines.push("");
  lines.push(`- 資料來源：${c.source === "google-sheet" ? "Google 試算表" : "網站內建資料（未連上試算表）"}`);
  lines.push(`- 已發布活動 ${c.activities.length} 場、故事 ${c.stories.length} 篇、照片 ${c.media.length} 張、公告 ${c.notices.length} 則`);
  lines.push(`- 錯誤 ${errors.length} 項、提醒 ${warnings.length} 項`);

  for (const ck of consistencyChecks(c)) lines.push(`- ${ck.ok ? "✅" : "⚠️"} ${ck.text}`);

  if (c.issues.length) {
    lines.push("");
    lines.push("| 等級 | 分頁 | 列號 | ID | 說明 |");
    lines.push("|---|---|---|---|---|");
    for (const i of c.issues) {
      lines.push(`| ${i.level === "error" ? "錯誤" : "提醒"} | ${i.table} | ${i.row ?? ""} | ${i.id ?? ""} | ${i.message.replace(/\|/g, "／")} |`);
    }
  }

  const text = lines.join("\n");
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
