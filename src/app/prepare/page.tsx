import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { lineUrl, mediaByUsage } from "@/lib/view";
import { Photo } from "@/components/Photo";
import { PrepChecklist } from "@/components/PrepChecklist";
import { Callout, LineCta, PageHero, SectionTitle } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "行前準備", description: "海洋活動行前準備：服裝裝備、健康提醒、安全教育、科技體適能、海況與延期說明。" };

const NOTICE_TYPES = [
  { t: "正常辦理", d: "依原定時間地點集合。" },
  { t: "調整場地", d: "因海況或場地因素改到其他地點，請依通知前往新集合點。" },
  { t: "延期", d: "本場改期，新日期以官方LINE或電話通知為準。" },
  { t: "取消", d: "本場停止辦理，後續安排以主辦單位通知為準。" },
];

export default async function PreparePage() {
  const c = await getContent();
  const blocks = c.activityBlocks.filter((b) => b.activityId === "*");
  const photo = mediaByUsage(c, "行前準備")[0];
  return (
    <>
      <PageHero eyebrow="BEFORE YOU GO" title="行前準備" lead="每場活動共用的出發前指南。各場次的集合時間與特別事項，請以活動頁與主辦單位通知為準。" />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          {photo ? <Photo m={photo} className="aspect-[16/9] rounded-3xl" caption sizes="(max-width: 1024px) 100vw, 60vw" /> : null}
          {blocks.map((b, i) => (
            <section key={b.title} className="card p-6">
              <p className="text-sm font-black text-teal">STEP {i + 1}｜{b.kind}</p>
              <h2 className="mt-1 text-xl font-bold">{b.title}</h2>
              <p className="mt-2 whitespace-pre-line text-[16px]">{b.body}</p>
            </section>
          ))}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <PrepChecklist />
          <LineCta url={lineUrl(c)} />
        </aside>
      </div>
      <section className="container-page pb-6">
        <SectionTitle eyebrow="NOTICES" title="活動異動怎麼看？" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NOTICE_TYPES.map((n) => (
            <div key={n.t} className="card p-5"><h3 className="text-lg font-bold">{n.t}</h3><p className="mt-1 text-[15px] text-ink-soft">{n.d}</p></div>
          ))}
        </div>
        <div className="mt-6">
          <Callout kind="warn">重大異動以主辦單位通知為準。網站公告是輔助資訊，不取代官方LINE或電話等個別通知。</Callout>
        </div>
      </section>
    </>
  );
}
