import Link from "next/link";
import { getActivities, photosFor, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs, SectionHead } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";

export async function generateMetadata() {
  const img = await resolveImage("1017-harbor-sign");
  return meta({ title: "共融食魚教育", description: "以通用學習設計（UDL）規劃：圖像化教材、大字版、任務拆解、可坐式操作、岸上替代觀察、支持人力與彈性休息。", path: "/inclusive/", image: img?.src });
}

const ITEMS = [
  ["圖像化教材", "任務圖卡用圖說話，每張只有三個動作；不一定要寫句子，可以畫、勾、貼或指給夥伴看。"],
  ["大字版提示", "大字關鍵字卡與文字化流程，讓聽得到、聽不清楚的人都看得懂下一步。"],
  ["任務拆解", "把「做一道料理」拆成清洗、排序、擺盤、觀察、品嚐、紀錄等小任務。"],
  ["可坐式操作", "在生態廚房可以坐著完成清洗、分類、擺盤與回饋。"],
  ["岸上替代觀察", "不適合下潮間帶時，在岸上觀察站用樣本箱、生態圖卡、照片完成等值任務。"],
  ["支持人力", "支持人員負責安全提醒，也協助任務轉譯、步驟拆解、同儕合作與回饋紀錄。"],
  ["彈性節奏與休息", "定點集合、短距離移動、中途休息；出發前先說明路線與休息點。"],
  ["手勢與手語協助", "港邊解說時，以手勢與手語協助理解。"],
];

export default async function Inclusive() {
  const incl = (await getActivities()).find((a) => a.type.includes("共融"));
  const photos = incl ? await photosFor((p) => p.activitySlug === incl.slug) : [];
  return (
    <>
      <PageHero eyebrow="Inclusive Design" title="共融食魚教育" lead="不是所有學習都必須用同一種方式。我們調整的是課程、動線和溝通方式，而不是把參與者分類。" img={await resolveImage("1017-harbor-sign")} />
      <Crumbs items={[{ label: "共融食魚教育" }]} />
      <section className="wrap py-12" aria-labelledby="h-udl">
        <SectionHead id="h-udl" eyebrow="UDL" title="共融學習設計" lead="以通用學習設計（Universal Design for Learning）為原則：多元表徵、多元參與、多元表達。一般體驗活動、校園課程與共融場次共用同一套核心教材，只調整支持方式。" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([t, d]) => <li key={t} className="rounded-2xl bg-harbor-50 p-5"><Icon name="hands" className="h-7 w-7 text-tide-600" /><h3 className="mt-2 text-lg">{t}</h3><p className="mt-1 text-[15px] text-ink-soft">{d}</p></li>)}
        </ul>
      </section>
      <section className="bg-sand-50 py-12" aria-labelledby="h-roles">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="h-roles" className="text-2xl">每個人都有一個重要位置</h2>
            <p className="mt-3">生態廚房的角色卡讓不同能力、不同速度的人，都能選到真正能參與的工作。重點是有意義地參與，不是每個人做完全一樣的事。</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {["食材清洗長", "步驟排序員", "擺盤設計師", "氣味觀察員", "品嚐回饋員", "紀錄分享員"].map((r) => <li key={r} className="rounded-xl bg-white p-3 text-center font-bold text-abyss ring-1 ring-abyss/10">{r}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-abyss/10">
            <h2 className="text-xl">我們怎麼處理參與者資訊</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>報名時了解的需求（溝通方式、移動、是否需陪伴、是否需休息），只用於課程支持與場域安排，不涉及醫療診斷或障別鑑定。</li>
              <li>網站不公開任何參與者的障別、健康資訊、身分證明或保險資料。</li>
            </ul>
          </div>
        </div>
      </section>
      {incl && (
        <section className="wrap py-12" aria-labelledby="h-1017">
          <SectionHead id="h-1017" eyebrow="115年度" title={`${incl.title}的現場`} action={{ href: `/activities/${incl.slug}/`, label: "看活動紀錄" }} />
          <Gallery images={photos} label="共融場次照片" />
        </section>
      )}
      <section className="wrap" aria-label="相關">
        <div className="flex flex-wrap gap-3"><Link href="/materials/" className="btn-line">下載任務圖卡</Link><Link href="/partners/" className="btn-line">合作夥伴</Link></div>
      </section>
    </>
  );
}
