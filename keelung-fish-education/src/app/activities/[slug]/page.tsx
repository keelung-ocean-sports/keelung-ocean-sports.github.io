import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivities, getMaterials, getStories, photosFor, resolveImage, resolveImages, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { fmtDate, shortDate, SITE_URL, type StopKey } from "@/lib/site";
import { Crumbs, Prose } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { Gallery } from "@/components/Gallery";
import { JourneyStrip } from "@/components/JourneyStrip";
import { Share } from "@/components/Share";
import { Icon } from "@/components/Icon";

export async function generateStaticParams() {
  return (await getActivities()).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = (await getActivities()).find((x) => x.slug === slug);
  if (!a) return {};
  const img = await resolveImage(a.coverImage);
  return meta({ title: `${shortDate(a.date)} ${a.title}`, description: `${fmtDate(a.date)}｜${a.summary}`, path: `/activities/${a.slug}/`, image: img?.src });
}

const INCLUSIVE = ["圖像化任務卡與大字版提示", "出發前說明路線與休息點", "任務拆解、一次一個步驟", "市場與漁港定點觀察，不需長距離移動", "港邊解說以手勢與手語協助", "生態廚房可坐式操作與角色分工", "支持人力陪同、彈性節奏"];

export default async function ActivityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = (await getActivities()).find((x) => x.slug === slug);
  if (!a) notFound();
  const cover = await resolveImage(a.coverImage, a.title);
  const gallery = a.gallery.length ? await resolveImages(a.gallery) : await photosFor((p) => p.activitySlug === a.slug);
  const story = (await getStories()).find((s) => s.slug === a.storySlug);
  const material = (await getMaterials()).find((m) => m.slug === a.materialSlug);
  const all = await getActivities();
  const idx = all.findIndex((x) => x.slug === a.slug);
  const prev = all[idx - 1], next = all[idx + 1];
  const isInclusive = a.type.includes("共融");
  const event = {
    "@context": "https://schema.org", "@type": "Event", name: a.title, startDate: a.date, eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: a.location, address: "基隆市" }, description: a.summary,
    organizer: { "@type": "Organization", name: "基隆市潮境理海生態保育協會" }, image: cover ? [SITE_URL.replace(/(https?:\/\/[^/]+).*/, "$1") + cover.src] : undefined,
  };
  return (
    <>
      <Crumbs items={[{ href: "/activities/", label: "活動" }, { label: `${shortDate(a.date)} ${a.title}` }]} />
      <article>
        <header className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-abyss px-3 py-1 font-bold text-white">{a.year}年度</span>
              <span className="rounded-full bg-tide-100 px-3 py-1 font-semibold text-tide-600">{a.type}</span>
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl">{a.title}</h1>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-[15px]">
              <div className="rounded-xl bg-harbor-50 p-3"><dt className="text-xs font-bold text-tide-600">日期</dt><dd className="font-semibold text-abyss"><time dateTime={a.date}>{fmtDate(a.date)}</time></dd></div>
              <div className="rounded-xl bg-harbor-50 p-3"><dt className="text-xs font-bold text-tide-600">參與人數</dt><dd className="font-semibold text-abyss">{a.participants ?? "—"} 人</dd></div>
              <div className="col-span-2 rounded-xl bg-harbor-50 p-3"><dt className="text-xs font-bold text-tide-600">地點</dt><dd className="font-semibold text-abyss">{a.location}</dd></div>
            </dl>
            <p className="mt-5 text-lg">{a.summary}</p>
          </div>
          <Photo img={cover} priority sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] w-full" />
        </header>

        <section className="bg-harbor-50 py-10" aria-labelledby="h-path">
          <div className="wrap">
            <h2 id="h-path" className="mb-2 text-xl">當日學習路徑</h2>
            <p className="mb-5 text-sm text-ink-soft">亮起的站為本場照片與紀錄中有安排的場域。</p>
            <JourneyStrip highlight={a.stops as StopKey[]} />
          </div>
        </section>

        <div className="wrap grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
          <section aria-labelledby="h-day">
            <h2 id="h-day" className="text-2xl">這一天</h2>
            <Prose text={a.content} />
            {isInclusive && (
              <div className="mt-8 rounded-2xl bg-tide-100/60 p-6">
                <h3 className="text-lg">本場的共融學習設計</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">{INCLUSIVE.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-tide-600" />{x}</li>)}</ul>
                <p className="mt-4 text-sm text-ink-soft">本網站不公開任何參與者的個人障別或健康資訊。<Link href="/inclusive/">了解共融食魚教育</Link></p>
              </div>
            )}
          </section>
          <aside className="space-y-4" aria-label="相關內容">
            {story && <Link href={`/stories/${story.slug}/`} className="card block p-5 no-underline hover:ring-coral-500"><p className="text-sm font-bold text-tide-600">活動故事</p><p className="mt-1 text-lg font-bold text-abyss">{story.title}</p><p className="mt-1 text-sm text-ink-soft">{story.summary}</p></Link>}
            {material && <div className="card p-5"><p className="text-sm font-bold text-tide-600">本場使用教材</p><p className="mt-1 font-bold text-abyss">{material.title}</p>{material.pdfUrl ? <a href={asset(material.pdfUrl)} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-[44px] items-center gap-1 font-semibold"><Icon name="download" className="h-5 w-5" />開啟 PDF</a> : <Link href="/materials/#lesson-plan" className="mt-2 inline-flex min-h-[44px] items-center">看教案架構</Link>}</div>}
            <Link href={`/results/${a.year}/`} className="card block p-5 no-underline hover:ring-coral-500"><p className="text-sm font-bold text-tide-600">對應年度成果</p><p className="mt-1 font-bold text-abyss">{a.year}年度成果館</p></Link>
            <Share title={`${shortDate(a.date)} ${a.title}｜潮境共學`} />
          </aside>
        </div>

        {gallery.length > 0 && (
          <section className="wrap pb-6" aria-labelledby="h-photos">
            <h2 id="h-photos" className="mb-5 text-2xl">活動照片</h2>
            <Gallery images={gallery} label={`${shortDate(a.date)} 活動照片`} />
          </section>
        )}

        <nav aria-label="上一場、下一場" className="wrap mt-10 grid gap-3 sm:grid-cols-2">
          {prev ? <Link href={`/activities/${prev.slug}/`} className="card p-4 no-underline"><span className="text-sm text-ink-soft">← 上一場</span><span className="block font-bold text-abyss">{shortDate(prev.date)} {prev.title}</span></Link> : <span />}
          {next && <Link href={`/activities/${next.slug}/`} className="card p-4 text-right no-underline"><span className="text-sm text-ink-soft">下一場 →</span><span className="block font-bold text-abyss">{shortDate(next.date)} {next.title}</span></Link>}
        </nav>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }} />
    </>
  );
}
