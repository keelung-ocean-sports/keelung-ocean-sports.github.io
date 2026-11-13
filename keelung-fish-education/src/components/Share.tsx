"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** 分享：手機用系統分享，另提供 LINE、Facebook 與複製連結。 */
export function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);
  const enc = encodeURIComponent;
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="分享這一頁">
      <button type="button" className="btn-line text-sm" onClick={async () => {
        const u = window.location.href;
        if (navigator.share) { try { await navigator.share({ title, url: u }); } catch {} return; }
        try { await navigator.clipboard.writeText(u); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
      }}><Icon name="share" className="h-4 w-4" />分享</button>
      <a className="btn-line text-sm" href={`https://social-plugins.line.me/lineit/share?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">LINE</a>
      <a className="btn-line text-sm" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      <span role="status" className="text-sm text-tide-600">{copied ? "已複製連結" : ""}</span>
    </div>
  );
}
