# 潮境共學｜基隆食魚教育

基隆市潮境理海生態保育協會經營的**長期食魚教育平台**，同時是**115年度食魚教育推廣計畫成果館**（農業部漁業署支持）。

- 網址：https://keelung-ocean-sports.github.io/keelung-fish-education/
- 位置：與「基隆海洋運動俱樂部」網站放在同一個 GitHub 儲存庫（`keelung-ocean-sports.github.io`）的 `keelung-fish-education/` 資料夾，由同一個 GitHub Actions 流程發布。
- 技術：Next.js 15（App Router、靜態輸出）＋ React 19 ＋ TypeScript ＋ Tailwind CSS 3
- 資料：Google 試算表（建置時讀取）＋ 內建備援資料 `content/seed/*.csv`

## 頁面

| 路徑 | 內容 |
|---|---|
| `/` | 首頁 |
| `/journey/` | 食魚學習路徑：市場 → 漁港 → 潮間帶 → 餐桌 |
| `/species/`、`/species/[slug]/` | 海味圖鑑（分類篩選） |
| `/fishing-methods/`、`/fishing-methods/[slug]/` | 漁法圖鑑 |
| `/activities/`、`/activities/[slug]/` | 活動列表（年度／類型篩選）與活動頁 |
| `/missions/` | 親子 QR 任務（localStorage，不收集個資） |
| `/materials/` | 教材中心 |
| `/inclusive/` | 共融食魚教育 |
| `/stories/`、`/stories/[slug]/` | 活動故事 |
| `/results/[year]/` | 年度成果館（目前 115） |
| `/about/`、`/partners/` | 關於、合作夥伴 |

## 本機開發

```bash
npm install
npm run dev          # http://localhost:3100/keelung-fish-education
npm run build        # 輸出到 out/
npm run content-report   # 內容檢核
```

## 環境變數

| 變數 | 說明 |
|---|---|
| `FISH_SHEET_ID` | 食魚教育公開內容管理表的 ID。不設定時用 `content/seed/`。 |
| `NEXT_PUBLIC_BASE_PATH` | 網址子路徑，預設 `/keelung-fish-education`。改用自訂網域時設為空字串。 |
| `NEXT_PUBLIC_SITE_URL` | 網站網域（sitemap、分享圖用），預設 `https://keelung-ocean-sports.github.io`。 |

## Google 試算表設定

1. 把 `docs/食魚教育網站公開內容管理表_範本.xlsx` 上傳到協會 Google 雲端硬碟，開啟後「檔案 → 另存為 Google 試算表」。
2. 全選 → 格式 → 數字 → 純文字。
3. 共用 →「知道連結的任何人」→「檢視者」。
4. 到 GitHub 儲存庫 Settings → Secrets and variables → Actions → **Variables** 新增 `FISH_SHEET_ID`。
5. Actions →「更新並發布網站」→ Run workflow，看 Summary 的「食魚教育網站內容檢核」。

防呆：分頁出現姓名、電話、保險、障別等欄位名稱時整頁拒讀；任一列含疑似身分證、手機或 Email 時該列隱藏；欄位錯誤的列略過；讀取失敗改用內建資料；各場人數加總與成果表不一致時成果館停止顯示該數字。

**報名表、保險名冊與個資絕不可放在這份試算表。**

## 圖片管理

- 網站照片放在 `public/media/`，每張有 `-800.webp` 與 `-1600.webp` 兩種寬度。
- 新增照片：把原始 JPG 放在任一資料夾，執行 `python3 scripts/make_images.py <資料夾>`，再到試算表 `photos` 分頁新增一列（id＝檔名、alt 必填）。
- 也可以直接在 `src` 欄位填公開的照片網址。

## 新增內容

- **活動**：`activities` 新增一列；照片在 `photos` 分頁，`activitySlug` 填活動的 slug。
- **魚種**：`species` 新增一列；`fishingMethods` 填漁法 slug。
- **教材**：PDF 放 `public/downloads/` 或用雲端公開連結，`materials` 新增一列。
- **年度成果**：`results` 新增該年度各指標（year＝116…）；網站自動產生 `/results/116/`。

非技術人員請看 `ADMIN_GUIDE.md`。
