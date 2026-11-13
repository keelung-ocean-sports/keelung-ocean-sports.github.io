"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, MORE } from "@/lib/site";
import { Icon } from "./Icon";

export function SiteHeader() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  const active = (h: string) => path.startsWith(h.replace(/\/$/, ""));
  return (
    <header className="sticky top-0 z-40 border-b border-abyss/10 bg-white/95 backdrop-blur">
      <a href="#main" className="skip">跳到主要內容</a>
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline" aria-label="潮境共學｜基隆食魚教育 首頁">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-abyss text-white"><Icon name="fish" className="h-5 w-5" /></span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-abyss">潮境共學</span>
            <span className="block text-[11px] tracking-wider text-ink-soft">基隆食魚教育</span>
          </span>
        </Link>
        <nav aria-label="主選單" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 no-underline ${active(n.href) ? "bg-harbor-100 text-abyss font-semibold" : "text-ink hover:bg-harbor-50"}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <button ref={btn} type="button" className="btn lg:hidden -mr-2 px-3 text-abyss" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} /><span className="text-sm">{open ? "關閉" : "選單"}</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="手機選單" className="border-t border-abyss/10 bg-white lg:hidden">
          <ul className="wrap grid grid-cols-2 gap-2 py-4">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="flex min-h-[48px] items-center rounded-xl bg-harbor-50 px-4 font-semibold text-abyss no-underline">{n.label}</Link></li>
            ))}
          </ul>
          <p className="wrap pb-1 text-xs font-bold tracking-widest text-ink-soft">探索更多</p>
          <ul className="wrap grid grid-cols-2 gap-2 pb-5">
            {MORE.map((n) => (
              <li key={n.href}><Link href={n.href} className="flex min-h-[44px] items-center rounded-xl px-4 text-ink no-underline ring-1 ring-abyss/10">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
