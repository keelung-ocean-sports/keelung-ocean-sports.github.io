import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import Link from "next/link";
import { formatDate, mediaByUsage, mediaMap, splitList } from "@/lib/view";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { PhotoWall, type WallItem } from "@/components/PhotoWall";
import { StoryWall, type StoryLite } from "@/components/StoryWall";
import { Empty, PageHero, SectionTitle } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "海洋故事與照片牆",
  description: "外木山與福隆的海洋運動故事：SUP、浮潛、親子與共融活動的現場紀錄與精選照片。",
  alternates: { canonical: "/stories/" },
};

export default async function StoriesPage() {
  const c = await getContent();
  const mm = mediaMap(c);
  const all = [...c.stories].reverse();
  const items: StoryLite[] = all.map((s) => {
    const m = s.coverId ? mm.get(s.coverId) : undefined;
    return { id: s.id, year: s.year, title: s.title, summary: s.summary, date: s.date, themes: splitList(s.themes), cover: m ? { src: m.src, alt: m.alt, pending: m.consent !== "已授權" } : undefined };
  });
  const actName = new Map(c.activities.map((a) => [a.id, a.name]));
  const photos: WallItem[] = c.media
    .filter((m) => m.kind === "照片" && m.activityId && actName.has(m.activityId))
    .sort((a, b) => (a.date || "").localeCompare(b.date || "") || Number(a.order || 999) - Number(b.order || 999))
    .map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權", date: m.date, theme: m.theme, href: `/activities/${m.activityId}/`, hrefLabel: `看這場活動：${actName.get(m.activityId)}` }));
  const videos = c.media.filter((m) => m.kind === "影片" && /^https:\/\//.test(m.src));
  const heroImg = mediaByUsage(c, "成果館主視覺")[0] ?? mediaByUsage(c, "年度精選")[0];
  const featured = all[0];
  const featuredCover = featured?.coverId ? mm.get(featured.coverId) : undefined;

  return (
    <>
      <PageHero image={heroImg} eyebrow="OCEAN STORIES" title="海洋故事" lead="每一篇故事都連結到實際辦理的活動，內容取自協會活動紀錄與相簿。" />
      <div className="container-page py-12">
        {featured ? (
          <Link href={`/stories/${featured.id}`} className="group mb-14 grid overflow-hidden rounded-[2rem] bg-deep text-white lg:grid-cols-[1.3fr_1fr]">
            <div className="relative min-h-[260px] sm:min-h-[360px]">
              {featuredCover ? <Photo m={featuredCover} className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 60vw" /> : null}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="eyebrow !text-sand">FEATURED｜{formatDate(featured.date).full}</p>
              <h2 className="mt-3 text-3xl font-black leading-snug !text-white sm:text-4xl">{featured.title}</h2>
              {featured.summary ? <p className="mt-3 text-lg text-white/85">{featured.summary}</p> : null}
              <span className="mt-6 inline-flex items-center gap-1 font-bold text-sand">閱讀故事<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ) : null}

        {items.length ? <StoryWall items={items.slice(1)} /> : <Empty>故事整理中，敬請期待。</Empty>}

        <section className="mt-20 scroll-mt-24" id="photo-wall" aria-labelledby="photo-wall-title">
          <SectionTitle id="photo-wall-title" eyebrow="PHOTO WALL" title="照片牆" lead="依活動日期或主題篩選。點照片放大，可左右滑動，並回到原活動頁。" />
          {photos.length ? <PhotoWall items={photos} /> : <Empty>活動照片整理中。</Empty>}
        </section>

        {videos.length ? (
          <section className="mt-20" aria-labelledby="videos">
            <SectionTitle id="videos" eyebrow="VIDEO" title="影音" />
            <ul className="grid gap-6 md:grid-cols-2">
              {videos.map((v) => (
                <li key={v.id} className="card overflow-hidden">
                  {/youtube\.com|youtu\.be/.test(v.src) ? (
                    <iframe
                      className="aspect-video w-full"
                      src={v.src.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube-nocookie.com/embed/")}
                      title={v.alt}
                      loading="lazy"
                      allow="accelerometer; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video className="aspect-video w-full bg-black" controls preload="none" src={v.src} aria-label={v.alt} />
                  )}
                  <p className="p-4 text-[15px]">{v.caption || v.alt}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
