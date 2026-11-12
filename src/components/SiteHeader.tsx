"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { NAV, NAV_SECONDARY } from "./nav";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid h-10 w-10 place-items-center rounded-full ${light ? "bg-white/15 text-white" : "bg-deep text-sand"}`}>
        <Icon name="wave" className="h-6 w-6" />
      </span>
      <span className="leading-tight">
        <span className={`block text-[17px] font-black tracking-wide ${light ? "text-white" : "text-deep"}`}>基隆海洋運動俱樂部</span>
        <span className={`block text-[10px] font-bold tracking-[0.18em] ${light ? "text-shallow" : "text-teal"}`}>KEELUNG OCEAN SPORTS CLUB</span>
      </span>
    </span>
  );
}

export function SiteHeader({ lineUrl }: { lineUrl?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-deep/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-sand focus:px-4 focus:py-2">
        跳到主要內容
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="基隆海洋運動俱樂部首頁">
          <Wordmark />
        </Link>
        <nav aria-label="主選單" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-[15px] font-semibold transition-colors ${active ? "bg-shallow/50 text-deep" : "text-ink-soft hover:text-deep"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {lineUrl ? (
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-[#06C755] px-4 text-sm font-bold text-white hover:bg-[#05a648] sm:inline-flex">
              <Icon name="line" className="h-5 w-5" />加入LINE
            </a>
          ) : null}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-deep hover:bg-shallow/40 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            <span className="sr-only">{open ? "關閉選單" : "開啟選單"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-menu" aria-label="手機選單" className="border-t border-deep/10 bg-white lg:hidden">
          <ul className="container-page grid gap-1 py-3">
            {[...NAV, ...NAV_SECONDARY].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex min-h-[48px] items-center justify-between rounded-xl px-3 text-[17px] font-semibold text-deep hover:bg-shallow/30">
                  {n.label}
                  <Icon name="arrow" className="h-4 w-4 text-teal" />
                </Link>
              </li>
            ))}
            {lineUrl ? (
              <li className="pt-2">
                <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="btn-line w-full">
                  <Icon name="line" />加入官方LINE
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
