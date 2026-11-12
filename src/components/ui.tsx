import Link from "next/link";
import type { ReactNode } from "react";
import type { Media } from "@/lib/cms-types";
import { Icon } from "./Icon";
import { Photo } from "./Photo";

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  tone = "deep",
  image,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  tone?: "deep" | "sand";
  image?: Media;
}) {
  if (image) {
    // 全幅照片頁首：照片在下、漸層遮罩讓文字可讀，但保留畫面主體
    return (
      <section className="relative isolate overflow-hidden bg-deep text-white">
        <div className="absolute inset-0 -z-10">
          <Photo m={image} className="h-full w-full" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep-900/90 via-deep-900/55 to-deep-900/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-deep-900/70 to-transparent" />
        <div className="container-page relative flex min-h-[46svh] flex-col justify-end py-14 sm:min-h-[52svh] sm:py-20">
          <p className="eyebrow !text-shallow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-[32px] font-black leading-tight !text-white sm:text-5xl">{title}</h1>
          {lead ? <p className="mt-4 max-w-2xl text-lg text-white/90">{lead}</p> : null}
          {children}
        </div>
      </section>
    );
  }
  const dark = tone === "deep";
  return (
    <section className={`${dark ? "bg-deep text-shallow" : "bg-sand-50 text-ink"} relative overflow-hidden`}>
      <svg aria-hidden className={`pointer-events-none absolute -right-20 bottom-0 h-64 w-[640px] ${dark ? "text-white/5" : "text-teal/10"}`} viewBox="0 0 640 256" fill="currentColor">
        <path d="M0 160c80 0 80-40 160-40s80 40 160 40 80-40 160-40 80 40 160 40v96H0z" />
        <path d="M0 200c80 0 80-30 160-30s80 30 160 30 80-30 160-30 80 30 160 30v56H0z" opacity=".7" />
      </svg>
      <div className="container-page relative py-14 sm:py-20">
        <p className={`eyebrow ${dark ? "!text-shallow" : ""}`}>{eyebrow}</p>
        <h1 className={`mt-3 text-[32px] font-black sm:text-5xl ${dark ? "!text-white" : ""}`}>{title}</h1>
        {lead ? <p className={`mt-4 max-w-2xl text-lg ${dark ? "text-shallow" : "text-ink-soft"}`}>{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** 共用水域安全提醒（精簡版），避免每頁重複大段文字。 */
export function SafetyNote() {
  return (
    <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-[15px] leading-7 text-rose-950 ring-1 ring-rose-200" role="note">
      <Icon name="alert" className="mt-1.5 h-4 w-4 shrink-0" />
      <span>
        水域活動是否進行，由教練依當日海況做 Go／No-Go 判斷；身體不適請在報到時主動告知。
        <Link href="/safety" className="ml-1 font-bold underline underline-offset-4">海洋安全學院</Link>
      </span>
    </p>
  );
}

export function SectionTitle({ eyebrow, title, lead, id, action }: { eyebrow?: string; title: string; lead?: string; id?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id} className="mt-2 text-[26px] font-black sm:text-[34px]">{title}</h2>
        {lead ? <p className="mt-2 max-w-2xl text-ink-soft">{lead}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-1 font-bold text-teal hover:text-deep">
          {action.label}<Icon name="arrow" className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function Callout({ kind = "info", title, children }: { kind?: "info" | "warn" | "safety"; title?: string; children: ReactNode }) {
  const styles = {
    info: "bg-shallow-50 ring-teal/30 text-deep",
    warn: "bg-amber-50 ring-amber-300 text-amber-950",
    safety: "bg-rose-50 ring-rose-200 text-rose-950",
  }[kind];
  return (
    <div className={`flex gap-3 rounded-2xl p-4 ring-1 sm:p-5 ${styles}`} role="note">
      <Icon name={kind === "info" ? "info" : "alert"} className="mt-1 h-5 w-5 shrink-0" />
      <div className="text-[15px] leading-7">
        {title ? <p className="font-bold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

export function LineCta({ url, compact = false }: { url?: string; compact?: boolean }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`btn-line ${compact ? "!min-h-[44px] !px-4 !py-2 text-sm" : ""}`}>
      <Icon name="line" />加入官方LINE
    </a>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-deep/15 p-8 text-center text-ink-soft">{children}</div>;
}
