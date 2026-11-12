# 基隆海洋運動俱樂部官方網站｜KEELUNG OCEAN SPORTS CLUB

基隆市潮境理海生態保育協會營運的公益海洋運動平台，含 115 年度互動成果館。
內容由 **Google 試算表** 管理，協會新增、修改、下架活動與成果不需要改程式。

- 技術：Next.js 15（App Router）＋ React 19 ＋ TypeScript ＋ Tailwind CSS 3
- 資料：Google 試算表（唯讀 CSV）＋ 內建備援資料 `content/seed/*.csv`
- 部署：免費方案用 GitHub Pages（靜態輸出＋排程更新）；也可部署到 Vercel 或任何支援 Node.js 20+ 的主機

---

## 1. 快速開始（本機預覽）

```bash
npm install
cp .env.example .env.local      # 依需要填寫
npm run dev                     # http://localhost:3000
```

正式版建置：

```bash
npm run build && npm start
```

> 沒有設定 `GOOGLE_SHEET_ID` 時，網站使用 `content/seed/` 的內建資料（取自期末成果報告），可以直接運作。

## 2. 環境變數

| 變數 | 說明 | 正式網站建議值 |
|---|---|---|
| `GOOGLE_SHEET_ID` | 網站公開內容管理表的 ID | 試算表網址 `/d/` 後面那串 |
| `CONTENT_REVALIDATE_SECONDS` | 試算表內容快取秒數 | `300` |
| `SITE_PREVIEW_MODE` | `true` 時顯示「肖像授權待確認」照片並整站 noindex | **正式網站不可設 true** |
| `CMS_CHECK_TOKEN` | 資料檢核頁與立即更新 API 的通行碼 | 自訂一組長密碼 |
| `NEXT_PUBLIC_SITE_URL` | 正式網址（sitemap 用） | `https://你的網域` |

## 3. 連接 Google 試算表

1. 把 `docs/網站公開內容管理表_範本.xlsx` 上傳到協會 Google 雲端硬碟，以 Google 試算表開啟（檔案 → 另存為 Google 試算表）。
2. 全選 → 格式 → 數字 → **純文字**（避免日期與數字被自動轉換）。
3. 共用設定：「知道連結的任何人」→「檢視者」。
   **這份試算表只能放可公開的內容**；報名主表、保險名冊、體適能紀錄絕不可放在同一個檔案。
4. 把試算表 ID 填進部署環境變數 `GOOGLE_SHEET_ID`，重新部署。
5. 開啟 `/cms-check?token=你的通行碼`，確認「資料來源：Google 試算表」且沒有錯誤。

網站的防呆機制：

- 只顯示「發布狀態＝已發布」的資料；照片另需「授權狀態＝已授權」。
- 分頁若出現身分證、生日、電話、保險、血氧等欄位名稱，**整個分頁拒絕讀取**。
- 任一列含疑似身分證字號或手機號碼，該列自動隱藏。
- 報名網址若是表單「編輯網址」（`/edit`），報名按鈕自動隱藏。
- 欄位格式錯誤的列會被略過，其他內容照常顯示；試算表無法讀取時退回內建資料，網站不會整個掛掉。
- 故事必須連結到存在且已發布的活動，否則不顯示。

## 4. 部署

### 4-1 免費方案（建議）：GitHub Pages 靜態網站

協會沒有付費主機時使用。網址為 `https://帳號名稱.github.io`，不需購買網域。

運作方式：GitHub Actions（`.github/workflows/deploy.yml`）每 30 分鐘從 Google 試算表讀取內容、建置成純靜態網站並發布；推送程式或在 Actions 頁按「Run workflow」也會立即更新。

1. 以協會專用帳號（建議另開一個協會 Gmail）註冊 GitHub 免費帳號。
2. 建立**公開**儲存庫，名稱必須是 `帳號名稱.github.io`（網站才會在網址根目錄，圖片路徑才正確）。
3. 推送本專案到 `main` 分支。
4. Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
5. Settings → Secrets and variables → Actions → Variables 新增 `GOOGLE_SHEET_ID`（試算表 ID）。之後若綁自訂網域，再新增 `SITE_URL`。
6. Actions → 「更新並發布網站」→ Run workflow。完成後開啟 `https://帳號名稱.github.io`。

靜態版的差異：

- 沒有 `/cms-check` 與 `/api/revalidate`。內容檢核結果顯示在每次執行的 **Summary**；立即更新改按 **Run workflow**。
- 本機測試靜態版：`npm run build:static`，輸出在 `out/`。
- 公開儲存庫的程式與 `content/seed` 內建資料任何人都看得到；這些都是已公開的內容，**不可把任何個資或未公開資料放進儲存庫**。
- GitHub 會停用 60 天沒有活動的公開儲存庫排程。流程每次執行時會呼叫 API 重新啟用；若仍被停用，到 Actions 頁按「Enable workflow」即可恢復。

### 4-2 付費或有伺服器時：Vercel／Node.js 主機

Vercel 免費 Hobby 方案依其規定僅限個人非商業使用，協會網站建議用 Pro 方案或其他 Node.js 20+ 主機。此模式保有 `/cms-check` 與 `/api/revalidate`，約 5 分鐘自動更新。

1. 把本專案推到 GitHub 儲存庫。
2. Vercel → Add New Project → 匯入該儲存庫（自動辨識 Next.js）。
3. 在 Environment Variables 填入第 2 節的變數（`SITE_PREVIEW_MODE` 留空或 `false`）。
4. Deploy，再到 Settings → Domains 綁定網域。

## 5. 立即更新（伺服器模式）

靜態版請到 GitHub Actions 按 Run workflow。伺服器模式改完試算表後最晚 `CONTENT_REVALIDATE_SECONDS` 秒會更新。要立刻更新：

```bash
curl -X POST "https://你的網域/api/revalidate?token=你的通行碼"
```

## 6. 專案結構

```
content/seed/        內建資料（與試算表分頁同名同欄位的 CSV）
docs/                管理操作說明、上線步驟、試算表範本
public/brand/        全民運動署、潮境理海協會 Logo（使用者提供原檔，未改色未變形）
public/media/115/    115 年度活動照片（取自期末成果報告所附協會相簿照片）
public/downloads/    科技體適能 A4 空白紀錄表
scripts/             產生試算表範本、內容檢核報告的腳本
.github/workflows/   GitHub Pages 自動建置與發布
src/app/             各頁面（首頁、關於、活動、行前、安全學院、體適能、故事、成果館、學習地圖、檢核頁）
src/components/      共用元件（活動日曆、燈箱、KPI 儀表板、安全測驗、檢查清單…）
src/lib/schema.ts    資料表欄位定義與檢核規則
src/lib/cms.ts       讀取試算表、個資攔截、發布與授權過濾
```

## 7. 新增年度（例如 116 年）

不需改程式：在「年度計畫」新增 116 一列（補助單位與 Logo 各年度獨立設定），其餘分頁的「年度」欄填 116，網站就會出現 `/results/116`。
若 116 年度補助單位不同，Logo 檔放到 `public/brand/` 或填可公開的圖片網址。

## 8. 授權與隱私

- 官方 Logo 依原檔使用，請依核定公文與補助規定確認標示方式。
- 照片皆為協會活動相簿真實影像，協會已於 115/11/12 確認授權；新增照片仍請先確認授權再改「已授權」。
- 網站不提供登入、不儲存任何個人資料；行前檢查清單只存在使用者自己的瀏覽器。
