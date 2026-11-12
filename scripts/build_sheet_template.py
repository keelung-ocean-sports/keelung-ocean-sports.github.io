"""產生「網站公開內容管理表」Excel 範本（可上傳到 Google 雲端硬碟後以 Google 試算表開啟）。

用法：python3 scripts/build_sheet_template.py
輸出：docs/網站公開內容管理表_範本.xlsx
內容取自 content/seed/*.csv（即網站目前內建的已核實資料）。
"""
import csv, os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED = os.path.join(ROOT, "content", "seed")
OUT = os.path.join(ROOT, "docs", "網站公開內容管理表_範本.xlsx")

ORDER = ["網站設定", "活動管理", "活動內容", "活動故事", "照片與影片", "年度KPI", "年度計畫", "年度歷程", "回饋與改善", "網站公告", "公開連結"]
PUB = "草稿,待審核,已發布,已封存"
LISTS = {
    "發布狀態": PUB, "公開狀態": PUB,
    "活動狀態": "規劃中,開放報名,額滿,候補,報名截止,場地調整,延期,取消,已完成",
    "異動公告類型": "一般,正常辦理,調整場地,延期,取消",
    "授權狀態": "已授權,待確認,不公開",
    "含未成年": "是,否,待確認", "清晰正面人臉": "是,否,待確認",
    "類型@照片與影片": "照片,影片",
    "類型@網站公告": "一般,正常辦理,調整場地,延期,取消",
    "類型@回饋與改善": "滿意度題項,學習成效,海洋觀察,安全測驗,改善追蹤,參與者心得",
    "類別": "核定KPI,統計指標",
    "確認狀態@年度KPI": "已列報,協會確認達標,待補佐證,待確認,未達成",
    "確認狀態@公開連結": "已確認,待確認",
    "改善狀態": "規劃中,執行中,已完成,暫緩",
    "是否公開": "是,否", "是否為填答網址": "是,否", "置頂": "是,否",
}
HEAD = PatternFill("solid", fgColor="0B3C49")

wb = Workbook()
guide = wb.active
guide.title = "使用說明"
lines = [
    "基隆海洋運動俱樂部｜網站公開內容管理表",
    "",
    "1. 這份試算表只能放「可以公開在網站上」的內容。報名主表、保險名冊、健康檢測、身分證、電話、生日、緊急聯絡人一律不可放進來。",
    "2. 請勿修改各分頁名稱與第一列標題；新增資料請往下加一列。",
    "3. 只有「發布狀態／公開狀態」＝已發布 的資料會出現在網站；草稿、待審核、已封存都不會顯示。",
    "4. 照片要「授權狀態」＝已授權 才會在正式網站公開。未成年或不同意露臉者，請標「不公開」。",
    "5. 日期一律寫成 2026-07-04 這種格式；全表請維持「純文字」格式（格式 → 數字 → 純文字）。",
    "6. 多個值用 | 分隔，例如活動類型「SUP入門體驗|浮潛親海體驗」。",
    "7. 報名表單網址請用表單「傳送」按鈕取得的填答網址（…/viewform 或 forms.gle），不要貼編輯網址（…/edit）。",
    "8. 修改後最晚 5 分鐘網站會更新；可到 /cms-check?token=通行碼 查看是否有欄位錯誤。",
    "9. 年度 KPI 的「確認狀態」填「已列報」會公開實績數字；「協會確認達標」會顯示已達標但不顯示人數（適用名冊不公開的項目）。",
    "10. 新年度：在「年度計畫」新增一列（例如 116），各表的「年度」欄填 116，就會自動長出 116 年度成果館。",
]
for i, t in enumerate(lines, 1):
    c = guide.cell(row=i, column=1, value=t)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    if i == 1:
        c.font = Font(bold=True, size=14, color="0B3C49")
guide.column_dimensions["A"].width = 110

for tab in ORDER:
    rows = list(csv.reader(open(os.path.join(SEED, f"{tab}.csv"), encoding="utf-8")))
    ws = wb.create_sheet(tab)
    header = rows[0]
    for r_i, row in enumerate(rows, 1):
        for c_i, v in enumerate(row, 1):
            cell = ws.cell(row=r_i, column=c_i, value=v)
            cell.number_format = "@"
            cell.alignment = Alignment(wrap_text=r_i > 1, vertical="top")
            if r_i == 1:
                cell.font = Font(bold=True, color="FFFFFF")
                cell.fill = HEAD
    ws.freeze_panes = "B2"
    for c_i, h in enumerate(header, 1):
        col = get_column_letter(c_i)
        ws.column_dimensions[col].width = 40 if h in ("簡介", "內文", "內容", "說明", "計算方法", "實績說明", "年度摘要", "佐證來源", "合作單位", "設定值", "替代文字") else max(12, min(24, len(h) * 2 + 4))
        opts = LISTS.get(f"{h}@{tab}") or LISTS.get(h)
        if opts:
            dv = DataValidation(type="list", formula1=f'"{opts}"', allow_blank=True, showErrorMessage=True,
                                errorTitle="選項不正確", error=f"請從下拉選單選擇：{opts}")
            ws.add_data_validation(dv)
            dv.add(f"{col}2:{col}1000")
    # 其餘空白列也預設為純文字
    for r_i in range(len(rows) + 1, 301):
        for c_i in range(1, len(header) + 1):
            ws.cell(row=r_i, column=c_i).number_format = "@"

wb.save(OUT)
print("saved", OUT)
