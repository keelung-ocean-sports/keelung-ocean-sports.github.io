"""由 content/seed/*.csv 產生「食魚教育網站公開內容管理表」範本（xlsx）。
用法：python3 scripts/build_sheet_template.py
上傳到 Google 雲端硬碟後以 Google 試算表開啟即可使用；分頁名稱與欄位名稱不可更改。
"""
import csv, glob, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORDER = ["activities", "stories", "species", "fishing_methods", "materials", "partners", "results", "photos", "site_settings"]
NOTE = {
 "activities": "活動。日期 YYYY-MM-DD；stops 用 market|harbor|tide|table；coverImage／gallery 填 photos 分頁的 id 或照片網址（多張用 | 分隔）；published 填 TRUE 才會顯示。",
 "stories": "活動故事。content 用「## 小標」分段；activitySlug 對應 activities 的 slug。",
 "species": "海味圖鑑。category：魚類、頭足類、蝦蟹類、貝類、海藻／石花菜、水產加工品。fishingMethods 填 fishing_methods 的 slug。",
 "fishing_methods": "漁法圖鑑。targetSpecies 填 species 的 slug。",
 "materials": "教材。category：親子一起玩、老師帶著教、活動現場用。pdfUrl 可填網站內路徑或雲端公開連結。",
 "partners": "合作夥伴。只寫正式資料中的實際角色。",
 "results": "年度成果。value 為實際值、target 為核定目標；尚未經結案確認的指標請維持 published=FALSE。",
 "photos": "照片目錄。src 填網站內照片代號或公開網址；alt 必填（給看不到照片的人）。",
 "site_settings": "網站設定（key／value）。",
}
wb = Workbook(); wb.remove(wb.active)
info = wb.create_sheet("說明")
info.append(["潮境共學｜基隆食魚教育 — 網站公開內容管理表"])
info.append(["⚠️ 這份試算表只能放可公開的內容。姓名、電話、Email、地址、身分證、保險、健康、障別、特殊需求、緊急聯絡人、未成年資料一律不可放進來。"])
info.append(["分頁名稱與第一列欄位名稱請勿修改。改完約 30 分鐘內網站自動更新。"])
for k in ORDER: info.append([k, NOTE[k]])
info.column_dimensions["A"].width = 18; info.column_dimensions["B"].width = 120
info["A1"].font = Font(bold=True, size=14)
for name in ORDER:
    ws = wb.create_sheet(name)
    with open(os.path.join(ROOT, "content", "seed", name + ".csv"), encoding="utf-8") as f:
        for row in csv.reader(f): ws.append(row)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor="0A2E42")
    for col in ws.columns:
        for c in col: c.number_format = "@"; c.alignment = Alignment(wrap_text=False, vertical="top")
        ws.column_dimensions[col[0].column_letter].width = 18
    ws.freeze_panes = "A2"
out = os.path.join(ROOT, "docs", "食魚教育網站公開內容管理表_範本.xlsx")
wb.save(out); print(out)
