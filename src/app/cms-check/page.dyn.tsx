import type { Metadata } from "next";
import { getContent, PREVIEW_MODE } from "@/lib/cms";
import { consistencyChecks } from "@/lib/checks";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "內容資料檢核", robots: { index: false, follow: false } };

export default async function CmsCheck({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const expected = process.env.CMS_CHECK_TOKEN;
  if (!expected || token !== expected) {
    return (
      <div className="container-page py-20">
        <h1 className="text-2xl font-black">內容資料檢核</h1>
        <p className="mt-3 text-ink-soft">此頁需要通行碼。請在網址後加上 ?token=通行碼（於部署環境變數 CMS_CHECK_TOKEN 設定）。</p>
      </div>
    );
  }
  const c = await getContent();
  const checks = consistencyChecks(c);
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-black">內容資料檢核</h1>
      <p className="mt-2 text-ink-soft">資料來源：{c.source === "google-sheet" ? "Google 試算表" : "網站內建資料（未連接或讀取失敗）"}｜預覽模式：{PREVIEW_MODE ? "開" : "關"}</p>

      <h2 className="mt-10 text-xl font-bold">數據一致性</h2>
      <ul className="mt-3 space-y-2">
        {checks.map((x, i) => (
          <li key={i} className={`rounded-xl p-3 text-[15px] ring-1 ${x.ok ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-300"}`}>{x.ok ? "✔" : "⚠"} {x.text}</li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold">欄位與格式問題（{c.issues.length}）</h2>
      {c.issues.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="bg-deep text-white"><tr><th className="p-2">等級</th><th className="p-2">分頁</th><th className="p-2">列</th><th className="p-2">ID</th><th className="p-2">問題</th></tr></thead>
            <tbody>
              {c.issues.map((x, i) => (
                <tr key={i} className="border-b border-deep/10 align-top">
                  <td className="p-2">{x.level === "error" ? "錯誤" : "提醒"}</td><td className="p-2">{x.table}</td><td className="p-2">{x.row ?? ""}</td><td className="p-2">{x.id ?? ""}</td><td className="p-2">{x.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="mt-3 text-emerald-800">沒有發現問題。</p>}
      <p className="mt-8 text-sm text-ink-soft">有錯誤的列不會出現在網站上，其他正確的內容照常顯示。修正試算表後，最晚 {process.env.CONTENT_REVALIDATE_SECONDS || 300} 秒會更新；也可呼叫 /api/revalidate 立即更新。</p>
    </div>
  );
}
