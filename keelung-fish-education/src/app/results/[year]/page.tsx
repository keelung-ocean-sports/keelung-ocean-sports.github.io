import Link from "next/link";
import { notFound } from "next/navigation";
import { activityCards, getActivities, getMaterials, getPartners, getResults, getSettings, getSpecies, getMethods, photosFor, resolveImage, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { fmtDate, shortDate } from "@/lib/site";
import { Crumbs, SectionHead } from "@/components/ui";
import { Stats } from "@/components/Stats";
import { Photo } from "@/components/Photo";
import { Gallery } from "@/components/Gallery";
import { JourneyStrip } from "@/components/JourneyStrip";
import { Share } from "@/components/Share";
import { Icon } from "@/components/Icon";

export async function generateStaticParams() {
  const ys = new Set((await getResults()).map((r) => r.year));
  return [...ys].map((year) => ({ year }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const s = await getSettings();
  const r = await getResults(year);
  const v = (m: string) => r.find((x) => x.metric === m);
  const img = await resolveImage("0919-group-banner");
  return meta({ title: `${year}年度成果館`, description: `${year}年度食魚教育推廣計畫「${s.program115}」：${v("activities")?.value ?? ""}場活動、實際參與${v("participants")?.value ?? ""}人次、自製教材與校園教案各1式。`, path: `/results/${year}/`, image: img?.src });
}

const TOC = [["overview", "成果數字"], ["timeline", "年度時間軸"], ["why", "計畫緣起"], ["path", "四大學習路徑"], ["school", "校園課程"], ["inclusive", "共融參與"], ["materials", "教材與教案"], ["partners", "合作網絡"], ["library", "圖鑑"], ["photos", "精選照片"], ["next", "延續方向"]];

export default async function Results({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const results = await getResults(year);
  if (!results.length) notFound();
  const s = await getSettings();
  const acts = (await getActivities()).filter((a) => a.year === year);
  const cards = await activityCards(acts);
  const v = (m: string) => results.find((x) => x.metric === m);
  const top = ["activities", "participants", "participantsRate", "material", "lessonPlan", "partners"].map(v).filter(Boolean);
  const stats = top.map((x) => ({ value: x!.value, unit: x!.unit, label: x!.label }));
  const target = v("participants")?.target;
  if (target) stats.splice(2, 0, { value: target, unit: "人次", label: "原定目標" });
  const sum = acts.reduce((t, a) => t + (a.participants ?? 0), 0);
  const mismatch = v("participants") && Number(v("participants")!.value) !== sum;
  const materials = await getMaterials();
  const handbook = materials.find((m) => m.slug === "bdz-fish-handbook");
  const cardsPdf = materials.find((m) => m.slug === "bdz-fish-mission-cards");
  const partners = await getPartners();
  const featured = await photosFor((p) => p.featured);
  const species = await getSpecies();
  const methods = await getMethods();
  const hero = await resolveImage("0919-group-banner");
  const school = acts.find((a) => a.type === "校園課程");
  const incl = acts.find((a) => a.type.includes("共融"));
  const schoolImg = school ? await resolveImage(school.coverImage) : null;
  const inclImg = await resolveImage("1017-harbor-sign");

  return (
    <>
      <Crumbs items={[{ label: `${year}年度成果館` }]} />
      <header className="wrap grid gap-8 py-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">{year}年度成果館</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{year}年度食魚教育推廣計畫</h1>
          <p className="mt-3 text-xl font-bold text-harbor-600">{s.program115}</p>
          <dl className="mt-5 grid gap-2 text-[15px] sm:grid-cols-2">
            <div className="rounded-xl bg-harbor-50 p-3"><dt className="text-xs font-bold text-tide-600">指導／補助</dt><dd className="font-semibold text-abyss">{s.supporter115}</dd></div>
            <div className="rounded-xl bg-harbor-50 p-3"><dt className="text-xs font-bold text-tide-600">執行</dt><dd className="font-semibold text-abyss">{s.org}</dd></div>
          </dl>
        </div>
        <Photo img={hero} priority sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[4/3] w-full" />
      </header>

      <nav aria-label="成果館目錄" className="sticky top-16 z-20 border-y border-abyss/10 bg-white/95 backdrop-blur">
        <ul className="wrap flex gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none]">
          {TOC.map(([id, l]) => <li key={id} className="shrink-0"><a href={`#${id}`} className="inline-flex min-h-[40px] items-center rounded-full px-3 text-abyss no-underline hover:bg-harbor-50">{l}</a></li>)}
        </ul>
      </nav>

      <section id="overview" className="wrap py-12" aria-labelledby="h-ov">
        <SectionHead id="h-ov" eyebrow="Results" title="成果數字" lead="核定目標與實際成果分開列示。實際參與人次為四場活動實到人數加總。" />
        {mismatch ? <p role="alert" className="rounded-xl bg-coral-100 p-4 text-coral-600">實際參與人次與各場人數加總不一致，請管理者檢查試算表。</p> : <Stats items={stats} />}
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
            <caption className="mb-3 text-left text-lg font-bold text-abyss">核定指標對照</caption>
            <thead><tr className="border-b-2 border-abyss/20 text-sm text-ink-soft"><th scope="col" className="py-2 pr-4">指標</th><th scope="col" className="py-2 pr-4">核定目標</th><th scope="col" className="py-2 pr-4">實際成果</th><th scope="col" className="py-2">說明</th></tr></thead>
            <tbody>
              {results.filter((r) => r.metric !== "participantsRate").map((r) => (
                <tr key={r.metric} className="border-b border-abyss/10 align-top">
                  <th scope="row" className="whitespace-nowrap py-3 pr-4 font-semibold text-abyss">{r.label}</th>
                  <td className="whitespace-nowrap py-3 pr-4 tabular-nums">{r.target ? `${r.target} ${r.unit}` : "—"}</td>
                  <td className="whitespace-nowrap py-3 pr-4 font-bold tabular-nums text-abyss">{r.value ? `${r.value} ${r.unit}` : "—"}</td>
                  <td className="py-3 text-ink-soft">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="timeline" className="bg-harbor-50 py-12" aria-labelledby="h-tl">
        <div className="wrap">
          <SectionHead id="h-tl" eyebrow="Timeline" title="年度時間軸" />
          <ol className="relative grid gap-6 md:grid-cols-4">
            <span className="absolute left-6 top-0 h-full w-0.5 bg-harbor-500/30 md:left-0 md:top-6 md:h-0.5 md:w-full" aria-hidden="true" />
            {cards.map((a) => (
              <li key={a.slug} className="relative pl-14 md:pl-0 md:pt-14">
                <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-abyss text-sm font-bold text-white ring-4 ring-harbor-50">{shortDate(a.date)}</span>
                <Link href={`/activities/${a.slug}/`} className="card block no-underline hover:ring-coral-500">
                  <Photo img={a.img} rounded={false} sizes="(min-width:768px) 25vw, 100vw" className="aspect-[4/3] w-full" />
                  <span className="block p-4">
                    <span className="text-sm font-semibold text-tide-600">{a.type}｜{a.participants} 人</span>
                    <span className="mt-1 block font-bold text-abyss">{a.title}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{a.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="why" className="wrap grid gap-10 py-12 lg:grid-cols-2" aria-labelledby="h-why">
        <div>
          <SectionHead id="h-why" eyebrow="Why" title="計畫緣起與問題意識" />
          <div className="space-y-4 text-[17px]">
            <p>基隆八斗子有市場、有漁港、有潮間帶，也有國立海洋科技博物館的生態廚房。這些場域就在生活周邊，但多數人買海鮮時，很少知道它從哪裡來、怎麼被捕到。</p>
            <p>另一方面，多數食魚教育仰賴口語講授與文字說明。對聽覺障礙者、身心障礙者及其家庭來說，真實場域裡的語言理解、移動與操作節奏，都可能讓他們只能在旁邊看。</p>
            <p>本計畫以通用學習設計為核心，把四個場域串成一條學習路線，用任務圖卡、定點學習與角色分工，讓不同條件的參與者都能真正動手完成任務。</p>
          </div>
        </div>
        <div id="path">
          <SectionHead eyebrow="Learning Path" title="四大學習路徑" />
          <JourneyStrip />
          <p className="mt-4 text-sm text-ink-soft">市場辨識、漁港漁法、潮間帶文化與生態廚房料理四大模組，是體驗活動與校園課程的共同核心。</p>
        </div>
      </section>

      <section className="bg-sand-50 py-12">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div id="school" aria-labelledby="h-school">
            <h2 id="h-school" className="text-2xl">校園課程</h2>
            {schoolImg && <Photo img={schoolImg} sizes="(min-width:1024px) 45vw, 100vw" className="mt-4 aspect-[4/3] w-full" />}
            <p className="mt-4">{school ? `${fmtDate(school.date)}，${school.title}，${school.participants} 人參與。` : ""}課程由國立臺灣海洋大學教師、德和國小與本會共同備課設計，課程流程整理為校園教案，由德和國小承接運用。</p>
            {school && <Link href={`/activities/${school.slug}/`} className="btn-line mt-4">看活動紀錄</Link>}
          </div>
          <div id="inclusive" aria-labelledby="h-inc">
            <h2 id="h-inc" className="text-2xl">共融參與</h2>
            <Photo img={inclImg} sizes="(min-width:1024px) 45vw, 100vw" className="mt-4 aspect-[4/3] w-full" />
            <p className="mt-4">{incl ? `${fmtDate(incl.date)}的${incl.title}，${incl.participants} 人參與。` : ""}以圖像化任務卡、定點學習、手勢與手語協助、可坐式操作與角色分工，讓不同條件的參與者在同一個場域一起完成任務。</p>
            <Link href="/inclusive/" className="btn-line mt-4">共融學習設計</Link>
          </div>
        </div>
      </section>

      <section id="materials" className="wrap py-12" aria-labelledby="h-mat">
        <SectionHead id="h-mat" eyebrow="Materials" title="教材與教案成果" />
        <div className="grid gap-6 md:grid-cols-3">
          {[handbook, cardsPdf].filter(Boolean).map((m) => (
            <div key={m!.slug} className="card flex gap-4 p-5">
              {m!.previewImage && /* eslint-disable-next-line @next/next/no-img-element */ <img src={asset(m!.previewImage)} alt={`${m!.title} 封面`} width={96} height={136} loading="lazy" className="h-36 w-24 shrink-0 rounded-md object-cover ring-1 ring-abyss/10" />}
              <div><p className="text-sm font-bold text-tide-600">自製教材 1 式</p><h3 className="mt-1 text-base">{m!.title}</h3><p className="text-sm text-ink-soft">{m!.printSize}</p><a href={asset(m!.pdfUrl)} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-[44px] items-center gap-1 font-semibold"><Icon name="download" className="h-5 w-5" />PDF</a></div>
            </div>
          ))}
          <div className="card p-5"><p className="text-sm font-bold text-tide-600">校園教案 1 式</p><h3 className="mt-1 text-base">{v("lessonPlan")?.description}</h3><Link href="/materials/#lesson-plan" className="mt-2 inline-flex min-h-[44px] items-center">看教案架構</Link></div>
        </div>
      </section>

      <section id="partners" className="bg-harbor-50 py-12" aria-labelledby="h-pt">
        <div className="wrap">
          <SectionHead id="h-pt" eyebrow="Partners" title={`合作網絡：${partners.length} 個單位`} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => <li key={p.id} className="rounded-2xl bg-white p-5 ring-1 ring-abyss/10"><p className="text-sm font-bold text-tide-600">{p.role}</p><p className="mt-1 font-bold text-abyss">{p.name}</p><p className="mt-2 text-sm text-ink-soft">{p.description}</p></li>)}
          </ul>
        </div>
      </section>

      <section id="library" className="wrap py-12" aria-labelledby="h-lib">
        <SectionHead id="h-lib" eyebrow="Library" title="海味圖鑑與漁法圖鑑" lead={`本年度建立海味 ${species.length} 種、漁法 ${methods.length} 種，後續年度持續擴充。`} />
        <div className="flex flex-wrap gap-3"><Link href="/species/" className="btn-line">海味圖鑑</Link><Link href="/fishing-methods/" className="btn-line">漁法圖鑑</Link><Link href="/stories/" className="btn-line">活動故事</Link></div>
      </section>

      <section id="photos" className="wrap py-12" aria-labelledby="h-ph">
        <SectionHead id="h-ph" eyebrow="Photos" title="精選照片" />
        <Gallery images={featured} label={`${year}年度精選照片`} />
      </section>

      <section id="next" className="bg-abyss py-12 text-white" aria-labelledby="h-next">
        <div className="wrap">
          <h2 id="h-next" className="text-2xl text-white">延續方向</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {["教案由德和國小承接，後續可在校內自行運用。", "任務圖卡與學習手冊公開下載，家長、老師與社區單位都可以使用。", "海味與漁法圖鑑持續增加；新年度活動與成果加在同一個網站。"].map((x) => <li key={x} className="rounded-2xl bg-white/10 p-5">{x}</li>)}
          </ul>
          <p className="mt-6 text-sm text-white/75">{s.fundingNote}</p>
          <div className="mt-6 inline-block rounded-2xl bg-white p-3"><Share title={`${year}年度成果館｜潮境共學`} /></div>
        </div>
      </section>
    </>
  );
}
