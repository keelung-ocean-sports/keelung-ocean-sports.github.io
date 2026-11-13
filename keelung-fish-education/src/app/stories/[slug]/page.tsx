import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivities, getStories, resolveImage, resolveImages } from "@/lib/content";
import { meta } from "@/lib/meta";
import { fmtDate } from "@/lib/site";
import { Crumbs, Prose } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { Gallery } from "@/components/Gallery";
import { Share } from "@/components/Share";

export async function generateStaticParams() {
  return (await getStories()).map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getStories()).find((x) => x.slug === slug);
  if (!s) return {};
  const img = await resolveImage(s.coverImage);
  return meta({ title: s.title, description: s.summary, path: `/stories/${s.slug}/`, image: img?.src });
}
export default async function StoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getStories()).find((x) => x.slug === slug);
  if (!s) notFound();
  const a = (await getActivities()).find((x) => x.slug === s.activitySlug);
  const cover = await resolveImage(s.coverImage, s.title);
  const gallery = await resolveImages(s.gallery);
  return (
    <>
      <Crumbs items={[{ href: "/stories/", label: "活動故事" }, { label: s.title }]} />
      <article className="wrap py-8">
        <header className="max-w-3xl">
          <p className="eyebrow"><time dateTime={s.date}>{fmtDate(s.date)}</time></p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{s.title}</h1>
          <p className="mt-3 text-lg text-ink-soft">{s.summary}</p>
        </header>
        <figure className="mt-8">
          <Photo img={cover} priority sizes="(min-width:1152px) 1100px, 100vw" className="aspect-[16/9] w-full" />
          {cover?.caption && <figcaption className="mt-2 text-sm text-ink-soft">{cover.caption}</figcaption>}
        </figure>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
          <Prose text={s.content} />
          <aside className="space-y-4">
            {a && <Link href={`/activities/${a.slug}/`} className="card block p-5 no-underline"><p className="text-sm font-bold text-tide-600">活動紀錄</p><p className="mt-1 font-bold text-abyss">{a.title}</p><p className="text-sm text-ink-soft">{a.participants} 人｜{a.location}</p></Link>}
            <Share title={`${s.title}｜潮境共學`} />
          </aside>
        </div>
        {gallery.length > 0 && <div className="mt-10"><Gallery images={gallery} label="故事照片" /></div>}
      </article>
    </>
  );
}
