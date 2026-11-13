import Link from "next/link";
import { getSettings, getYears, resolveImage, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";

export async function generateMetadata() {
  return meta({ title: "關於潮境共學", description: "潮境共學是基隆市潮境理海生態保育協會經營的長期食魚教育平台。", path: "/about/" });
}
export default async function About() {
  const s = await getSettings();
  const years = await getYears();
  return (
    <>
      <PageHero title="關於潮境共學" lead={s.tagline} img={await resolveImage("0919-fisher-talk")} />
      <Crumbs items={[{ label: "關於潮境共學" }]} />
      <div className="wrap grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-[17px]">
          <h2 className="text-2xl">一個長期的基隆食魚教育平台</h2>
          <p>「潮境共學」由{s.org}經營，以八斗子的市場、漁港、潮間帶和生態廚房作為認識海洋與食物的學習場域。</p>
          <p>網站將持續累積每年的活動紀錄、海味與漁法圖鑑、教材及年度成果，115年度為第一年。</p>
          <h2 className="pt-4 text-2xl">推廣理念</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>認識在地漁產與漁法，支持國產水產品。</li>
            <li>吃在地、吃當季、吃適量。</li>
            <li>以共融設計讓不同需求的參與者都能參與。</li>
            <li>潮間帶以觀察為主，不帶走生物。</li>
          </ul>
          <h2 className="pt-4 text-2xl">年度成果</h2>
          <ul className="flex flex-wrap gap-2">{years.map((y) => <li key={y}><Link href={`/results/${y}/`} className="btn-line">{y}年度成果館</Link></li>)}</ul>
        </div>
        <aside className="h-fit rounded-3xl bg-harbor-50 p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/chaojing-association-logo.png")} alt={`${s.org} 標誌`} width={96} height={96} className="h-24 w-24 rounded-full bg-white object-contain p-2" />
          <p className="mt-4 font-bold text-abyss">{s.org}</p>
          <p className="mt-3 text-sm">{s.fundingNote}</p>
          {s.contactNote && <p className="mt-3 text-sm">{s.contactNote}</p>}
          {s.orgSite && <a href={s.orgSite} className="mt-4 inline-flex min-h-[44px] items-center font-semibold">協會的海洋運動網站</a>}
        </aside>
      </div>
    </>
  );
}
