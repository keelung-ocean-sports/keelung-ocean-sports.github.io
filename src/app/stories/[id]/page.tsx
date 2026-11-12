import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms";
import { formatDate, mediaMap, pickMedia, splitList } from "@/lib/view";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";

export const revalidate = 300;

export async function generateStaticParams() {
  const c = await getContent();
  return c.stories.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await getContent();
  const s = c.stories.find((x) => x.id === id);
  if (!s) return {};
  const cover = s.coverId ? mediaMap(c).get(s.coverId) : undefined;
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/stories/${s.id}/` },
    openGraph: { title: s.title, description: s.summary, type: "article", images: cover ? [{ url: cover.src, alt: cover.alt }] : undefined },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getContent();
  const s = c.stories.find((x) => x.id === id);
  if (!s) notFound();
  const a = c.activities.find((x) => x.id === s.activityId);
  const cover = s.coverId ? mediaMap(c).get(s.coverId) : undefined;
  const photos = pickMedia(c, splitList(s.photoIds));
  const d = formatDate(s.date);
  const paras = s.body.split(/\n\s*\n/);
  // 文字之間穿插照片：第 1、3 段後各放一張（不與封面重複）
  const inline = photos.filter((m) => m.id !== cover?.id).slice(0, 2);
  const idx = c.stories.findIndex((x) => x.id === s.id);
  const prev = c.stories[idx - 1];
  const next = c.stories[idx + 1];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-deep text-white">
        {cover ? <div className="absolute inset-0 -z-10"><Photo m={cover} className="h-full w-full" sizes="100vw" priority /></div> : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-900 via-deep-900/50 to-deep-900/10" />
        <div className="container-page flex min-h-[60svh] flex-col justify-end py-14 sm:py-20">
          <nav aria-label="麵包屑" className="text-sm text-shallow"><Link href="/stories" className="hover:underline">海洋故事</Link> ／ {s.year}年度</nav>
          <p className="mt-4 font-bold text-sand">{d.full}｜{splitList(s.themes).join("・")}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black !text-white sm:text-5xl">{s.title}</h1>
          {s.summary ? <p className="mt-4 max-w-2xl text-lg text-white/90">{s.summary}</p> : null}
        </div>
      </header>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="prose-zh max-w-2xl text-[18px] leading-9">
            {paras.map((p, i) => (
              <div key={i}>
                <p className={i === 0 ? "text-[20px] font-medium leading-10 text-deep" : ""}>{p}</p>
                {(i === 0 || i === 2) && inline[i === 0 ? 0 : 1] ? (
                  <figure className="my-8 -mx-4 sm:mx-0">
                    <Photo m={inline[i === 0 ? 0 : 1]} className="aspect-[3/2] sm:rounded-3xl" sizes="(max-width: 768px) 100vw, 672px" />
                    <figcaption className="mt-2 px-4 text-sm text-ink-soft sm:px-0">{inline[i === 0 ? 0 : 1].caption || inline[i === 0 ? 0 : 1].alt}</figcaption>
                  </figure>
                ) : null}
              </div>
            ))}
          </div>
          {photos.length ? (
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-black">活動照片</h2>
              <Gallery layout="mosaic" items={photos.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權", date: m.date }))} />
            </div>
          ) : null}
          <nav aria-label="其他故事" className="mt-12 grid gap-3 border-t border-deep/10 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/stories/${prev.id}`} className="group rounded-2xl p-4 ring-1 ring-deep/10 hover:ring-teal">
                <span className="text-sm text-ink-soft">← 上一篇</span>
                <span className="mt-1 block font-bold text-deep group-hover:text-teal">{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/stories/${next.id}`} className="group rounded-2xl p-4 text-right ring-1 ring-deep/10 hover:ring-teal">
                <span className="text-sm text-ink-soft">下一篇 →</span>
                <span className="mt-1 block font-bold text-deep group-hover:text-teal">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>
        <aside className="space-y-4">
          {a ? (
            <div className="card p-5">
              <p className="text-sm font-bold text-teal">連結活動</p>
              <p className="mt-1 text-lg font-bold text-deep">{a.name}</p>
              <p className="text-[15px] text-ink-soft">{[formatDate(a.date).full, a.location].filter(Boolean).join("｜")}</p>
              {a.result ? <p className="mt-2 text-[15px]">{a.result}</p> : null}
              <Link href={`/activities/${a.id}`} className="mt-3 inline-flex items-center gap-1 font-bold text-teal">活動資料<Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
          ) : null}
          <div className="rounded-2xl bg-shallow-50 p-5 text-sm text-ink-soft ring-1 ring-teal/15">
            <p className="font-bold text-deep">資料來源</p>
            <p className="mt-1">{s.source}</p>
          </div>
          <Link href={`/results/${s.year}`} className="btn-outline w-full text-deep">看{s.year}年度成果館</Link>
        </aside>
      </div>
    </article>
  );
}
