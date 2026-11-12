"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const ITEMS = [
  "確認活動日期、時段與集合地點",
  "已完成主辦單位指定的線上安全教育任務",
  "前一晚睡飽，活動前適量進食",
  "準備可下水的快乾衣物或防寒衣",
  "毛巾、換洗衣物、飲用水",
  "防曬用品與帽子",
  "包趾水鞋或涼鞋",
  "眼鏡固定繩（如需要）",
  "身體狀況有需要告知教練的事項已記下",
  "已加入官方LINE，可以收到海況延期通知",
];
const KEY = "kosc-prep-checklist-v1";

export function PrepChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => ITEMS.map(() => false));
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(v) && v.length === ITEMS.length) setChecked(v.map(Boolean));
    } catch {}
  }, []);
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  const n = checked.filter(Boolean).length;
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">我的出發前檢查</h3>
        <span className="text-sm font-bold text-teal">{n}／{ITEMS.length}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {ITEMS.map((t, i) => (
          <li key={t}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-shallow-50">
              <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} className="peer sr-only" />
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ring-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber-400 ${checked[i] ? "bg-teal text-white ring-teal" : "ring-deep/25"}`}>
                {checked[i] ? <Icon name="check" className="h-4 w-4" /> : null}
              </span>
              <span className={`text-[16px] ${checked[i] ? "text-ink-soft line-through" : ""}`}>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">勾選只存在你自己的瀏覽器，作為個人提醒，不會送出，也不代表完成任何正式任務。</p>
    </div>
  );
}
