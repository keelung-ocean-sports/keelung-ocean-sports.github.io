import Link from "next/link";
import { activityCards, getMaterials, getPartners, getResults, getSettings, getSpecies, getMethods, resolveImage, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { JourneyStrip } from "@/components/JourneyStrip";
import { Stats } from "@/components/Stats";
import { ActivityCard } from "@/components/cards";
import { SectionHead } from "@/components/ui";

export async function generateMetadata() {
  const s = await getSettings();
  const img = await resolveImage(s.heroImage);
  return meta({ description: `${s.tagline}。八斗子市場、漁港、潮間帶到海味餐桌的食魚教育，以及115年度食魚教育推廣計畫成果。`, path: "/", image: img?.src });
}

export default async function Home() {
  const s = await getSettings();
  const hero = await resolveImage(s.heroImage);
  const results = await getResults("115");
  const r = (m: string) => results.find((x) => x.metric === m);
  const cards = await activityCards();
  const species = (await getSpecies()).slice(0, 3);
  const speciesImgs = await Promise.all(species.map((x) => resolveImage(x.coverImage)));
  const methodImg = await resolveImage("0919-squid-boat");
  const missionImg = await resolveImage("0816-fish-id");
  const inclusiveImg = await resolveImage("1017-kitchen-wide");
  const materials = (await getMaterials()).filter((m) => ["bdz-fish-handbook", "lesson-plan", "bdz-fish-mission-cards", "family-mission"].includes(m.slug));
  const partners = await getPartners();
  const methods = await getMethods();

  const stats = ["experience", "school", "participants", "material", "lessonPlan", "partners"].map((m) => r(m)).filter(Boolean).map((x) => ({
    value: x!.value, unit: x!.unit, label: x!.label,
  }));

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-abyss text-white">
        <Photo img={hero} priority rounded={false} sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-[70%_40%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-abyss/95 via-abyss/75 to-abyss/10 md:to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-abyss to-transparent md:hidden" aria-hidden="true" />
        <div className="wrap flex min-h-[78vh] flex-col justify-end py-14 md:min-h-[640px] md:justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-tide-100">{s.siteNameEn}</p>
          <h1 className="mt-3 max-w-xl text-4xl leading-tight text-white sm:text-6xl">潮境共學<span className="block text-2xl font-bold text-white/90 sm:text-4xl">基隆食魚教育</span></h1>
          <p className="mt-5 max-w-md text-lg text-white/90">{s.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/journey/" className="btn-primary">開始八斗子海味探索 <Icon name="arrow" className="h-5 w-5" /></Link>
            <Link href="/results/115/" className="btn-ghost">查看115年度成果</Link>
          </div>
        </div>
      </section>

      {/* 2. 115 計畫識別 */}
      <section aria-label="115年度計畫" className="border-b border-abyss/10 bg-sand-50">
        <div className="wrap grid gap-4 py-6 text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <span className="w-fit rounded-full bg-abyss px-3 py-1 font-bold text-white">115年度食魚教育推廣計畫</span>
          <p className="font-semibold text-abyss">{s.program115}</p>
          <p className="text-ink-soft">指導／補助：{s.supporter115}<span className="mx-2" aria-hidden="true">｜</span>主辦：{s.org}</p>
        </div>
      </section>

      {/* 3. 四站 */}
      <section className="wrap py-16" aria-labelledby="h-journey">
        <SectionHead id="h-journey" title="八斗子食魚學習路徑" lead="從八斗子市場認識魚貨，到漁港了解漁法、到潮間帶觀察海岸，最後在生態廚房完成料理。" action={{ href: "/journey/", label: "看完整學習路徑" }} />
        <JourneyStrip />
      </section>

      {/* 4. 成果數字 */}
      <section className="bg-abyss py-16 text-white" aria-labelledby="h-stats">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-tide-100">115年度</p><h2 id="h-stats" className="mt-1 text-2xl text-white sm:text-3xl">年度成果</h2></div>
            <Link href="/results/115/" className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-white">成果館 <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <Stats items={stats} dark />
        </div>
      </section>

      {/* 5-7. 圖鑑、漁法、任務入口 */}
      <section className="wrap py-16" aria-label="探索入口">
        <div className="grid gap-6 lg:grid-cols-3">
          <EntryCard href="/species/" eyebrow="海味圖鑑" title="今天市場有什麼魚？" text={`${species.map((x) => x.name).join("、")}……認識八斗子常見的海味。`} img={speciesImgs[0]} />
          <EntryCard href="/fishing-methods/" eyebrow="漁法圖鑑" title="這條魚是怎麼被捕到的？" text={`${methods.map((m) => m.name).join("、")}，同一種魚，不同捕法。`} img={methodImg} />
          <EntryCard href="/missions/" eyebrow="親子任務" title="成為八斗子海味小偵探" text="用手機就能玩的四關任務，完成後可領取數位完成卡。" img={missionImg} />
        </div>
      </section>

      {/* 8. 四場活動 */}
      <section className="bg-harbor-50 py-16" aria-labelledby="h-acts">
        <div className="wrap">
          <SectionHead id="h-acts" eyebrow="115年度活動" title="115年度活動紀錄" action={{ href: "/activities/", label: "全部活動" }} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{cards.map((a) => <li key={a.slug}><ActivityCard a={a} /></li>)}</ul>
        </div>
      </section>

      {/* 9. 共融 */}
      <section className="wrap grid items-center gap-10 py-16 lg:grid-cols-2" aria-labelledby="h-inc">
        <Photo img={inclusiveImg} sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[4/3] w-full" />
        <div>
          <p className="eyebrow">共融食魚教育</p>
          <h2 id="h-inc" className="mt-1 text-2xl sm:text-3xl">讓每個人都能參與的食魚課</h2>
          <p className="mt-3 text-ink-soft">活動採用圖像化教材、任務拆解與角色分工，讓不同需求的參與者都能動手參與。</p>
          <ul className="mt-5 grid grid-cols-2 gap-2 text-[15px]">
            {["圖像化教材", "大字版提示", "任務拆解", "可坐式操作", "岸上替代觀察", "支持人力", "彈性休息"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-tide-600" />{x}</li>
            ))}
          </ul>
          <Link href="/inclusive/" className="btn-line mt-6">共融設計怎麼做</Link>
        </div>
      </section>

      {/* 10. 教材 */}
      <section className="bg-sand-50 py-16" aria-labelledby="h-mat">
        <div className="wrap">
          <SectionHead id="h-mat" eyebrow="教材下載" title="《八斗子食魚探索任務圖卡與學習手冊》" lead="學習手冊、任務圖卡與校園教案，提供家長與教師下載使用。" action={{ href: "/materials/", label: "教材中心" }} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((m) => (
              <li key={m.slug} className="card flex flex-col p-5">
                <p className="text-sm font-semibold text-tide-600">{m.category}</p>
                <h3 className="mt-1 text-lg">{m.title.replace(/《八斗子食魚探索任務圖卡與學習手冊》/, "")}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{m.description}</p>
                {m.pdfUrl ? <a href={asset(m.pdfUrl)} className="mt-4 inline-flex min-h-[44px] items-center gap-1 font-semibold" target="_blank" rel="noopener"><Icon name="download" className="h-5 w-5" />開啟 PDF<span className="sr-only">：{m.title}</span></a>
                  : <Link href="/materials/#lesson-plan" className="mt-4 inline-flex min-h-[44px] items-center gap-1 font-semibold">看教案</Link>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11. 合作網絡 */}
      <section className="wrap py-16" aria-labelledby="h-pt">
        <SectionHead id="h-pt" eyebrow="在地單位" title="合作單位" action={{ href: "/partners/", label: "合作夥伴" }} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {partners.map((p) => (
            <li key={p.id} className="rounded-2xl bg-harbor-50 p-4">
              <p className="text-xs font-bold text-tide-600">{p.role}</p>
              <p className="mt-1 font-bold text-abyss">{p.name}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function EntryCard({ href, eyebrow, title, text, img }: { href: string; eyebrow: string; title: string; text: string; img: Awaited<ReturnType<typeof resolveImage>> }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-abyss text-white">
      <Photo img={img} rounded={false} sizes="(min-width:1024px) 33vw, 100vw" className="aspect-[4/3] w-full opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-tide-100">{eyebrow}</p>
        <h2 className="mt-1 text-2xl text-white"><Link href={href} className="text-white no-underline after:absolute after:inset-0">{title}</Link></h2>
        <p className="mt-2 text-sm text-white/85">{text}</p>
      </div>
    </article>
  );
}
