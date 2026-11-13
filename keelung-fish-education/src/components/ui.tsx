import Link from "next/link";
import type { Img } from "@/lib/content";
import { Photo } from "./Photo";
import { Icon } from "./Icon";

export function PageHero({ eyebrow, title, lead, img, children }: { eyebrow?: string; title: string; lead?: string; img?: Img | null; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-abyss text-white">
      {img && <Photo img={img} priority rounded={false} className="absolute inset-0 h-full w-full opacity-40" />}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/30" aria-hidden="true" />
      <div className="wrap relative py-14 sm:py-20">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.25em] text-tide-100">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl text-white sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="麵包屑" className="wrap pt-5 text-sm text-ink-soft">
      <ol className="flex flex-wrap gap-1">
        <li><Link href="/">首頁</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex gap-1"><span aria-hidden="true">/</span>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHead({ eyebrow, title, lead, id, action }: { eyebrow?: string; title: string; lead?: string; id?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="mt-1 text-2xl sm:text-3xl">{title}</h2>
        {lead && <p className="mt-3 text-ink-soft">{lead}</p>}
      </div>
      {action && <Link href={action.href} className="inline-flex min-h-[44px] items-center gap-1 font-semibold">{action.label}<Icon name="arrow" className="h-4 w-4" /></Link>}
    </div>
  );
}

/** 純文字內容：「## 標題」成為小標，空行分段。 */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-sea max-w-2xl text-[17px]">
      {blocks.flatMap((b, i) => {
        const lines = b.split("\n");
        return lines.map((l, j) => (l.startsWith("## ") ? <h2 key={`${i}-${j}`}>{l.slice(3)}</h2> : l.trim() ? <p key={`${i}-${j}`}>{l}</p> : null));
      })}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children || (typeof children === "string" && !children.trim())) return null;
  return (
    <div className="border-t border-abyss/10 py-4">
      <dt className="text-sm font-bold text-tide-600">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
