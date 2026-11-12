import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function PageHero({ eyebrow, title, lead, children, tone = "deep" }: { eyebrow: string; title: string; lead?: string; children?: ReactNode; tone?: "deep" | "sand" }) {
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
