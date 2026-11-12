import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { mediaMap, splitList } from "@/lib/view";
import { StoryWall, type StoryLite } from "@/components/StoryWall";
import { Gallery } from "@/components/Gallery";
import { Callout, Empty, PageHero, SectionTitle } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "海洋故事", description: "依活動日期與主題整理的海洋運動故事、照片與影音。" };

export default async function StoriesPage() {
  const c = await getContent();
  const mm = mediaMap(c);
  const items: StoryLite[] = [...c.stories].reverse().map((s) => {
    const m = s.coverId ? mm.get(s.coverId) : undefined;
    return { id: s.id, year: s.year, title: s.title, summary: s.summary, date: s.date, themes: splitList(s.themes), cover: m ? { src: m.src, alt: m.alt, pending: m.consent !== "已授權" } : undefined };
  });
  const photos = c.media.filter((m) => m.kind === "照片" && m.activityId);
  const videos = c.media.filter((m) => m.kind === "影片");

  return (
    <>
      <PageHero eyebrow="OCEAN STORIES" title="海洋故事" lead="每一篇故事都連結到實際辦理的活動，內容取自協會活動紀錄與相簿。" />
      <div className="container-page py-12">
        {items.length ? <StoryWall items={items} /> : <Empty>故事整理中，敬請期待。</Empty>}

        <section className="mt-20" aria-labelledby="photo-wall">
          <SectionTitle id="photo-wall" eyebrow="PHOTO WALL" title="照片牆" lead="點照片可放大瀏覽，標籤為活動日期。" />
          {photos.length ? (
            <Gallery
              columns="sm:grid-cols-3 lg:grid-cols-4"
              items={photos.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權", meta: m.date ? `${Number(m.date.slice(5, 7))}/${Number(m.date.slice(8))}` : undefined }))}
            />
          ) : (
            <Empty>活動照片完成肖像授權確認後，會在這裡公開。</Empty>
          )}
        </section>

        <section className="mt-20" aria-labelledby="videos">
          <SectionTitle id="videos" eyebrow="VIDEO" title="影音" />
          {videos.length ? (
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
          ) : (
            <Callout>活動影片與成果影片完成授權與上傳後，會在這裡播放。</Callout>
          )}
        </section>
      </div>
    </>
  );
}
