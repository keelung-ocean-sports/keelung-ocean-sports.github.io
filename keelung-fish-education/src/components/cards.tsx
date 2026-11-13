import Link from "next/link";
import type { Img } from "@/lib/content";
import { Photo } from "./Photo";
import { shortDate } from "@/lib/site";

export type ActivityCardData = { slug: string; date: string; title: string; type: string; participants: number | null; summary: string; location: string; img: Img | null; year: string };

export function ActivityCard({ a, headingLevel = 3 }: { a: ActivityCardData; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="card group relative flex h-full flex-col">
      <Photo img={a.img} rounded={false} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-abyss px-2.5 py-0.5 font-bold text-white">{shortDate(a.date)}</span>
          <span className="rounded-full bg-tide-100 px-2.5 py-0.5 font-semibold text-tide-600">{a.type}</span>
          {a.participants != null && <span className="text-ink-soft">{a.participants} 人</span>}
        </p>
        <H className="mt-3 text-lg">
          <Link href={`/activities/${a.slug}/`} className="text-abyss no-underline after:absolute after:inset-0 group-hover:underline">{a.title}</Link>
        </H>
        <p className="mt-2 line-clamp-3 text-[15px] text-ink-soft">{a.summary}</p>
      </div>
    </article>
  );
}

export function TileCard({ href, title, sub, img, tag, body }: { href: string; title: string; sub?: string; img: Img | null; tag?: string; body?: string }) {
  return (
    <article className="card group relative flex h-full flex-col">
      <Photo img={img} rounded={false} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        {tag && <p className="text-sm font-semibold text-tide-600">{tag}</p>}
        <h3 className="mt-1 text-xl"><Link href={href} className="text-abyss no-underline after:absolute after:inset-0 group-hover:underline">{title}</Link></h3>
        {sub && <p className="text-sm text-ink-soft">{sub}</p>}
        {body && <p className="mt-2 line-clamp-3 text-[15px] text-ink-soft">{body}</p>}
      </div>
    </article>
  );
}
