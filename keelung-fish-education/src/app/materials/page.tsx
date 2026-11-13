import { getMaterials, resolveImage, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";
import { Icon } from "@/components/Icon";

export async function generateMetadata() {
  return meta({ title: "教材中心", description: "《八斗子食魚探索任務圖卡與學習手冊》、任務圖卡與校園教案，依親子、教師與活動現場分類下載。", path: "/materials/", image: asset("/downloads/hb-01.png") });
}

const GROUPS = [
  { key: "親子一起玩", id: "family", lead: "週末帶孩子去八斗子，或在家先玩一輪。" },
  { key: "老師帶著教", id: "teachers", lead: "校園課程可以直接使用的教案架構與學習單。" },
  { key: "活動現場用", id: "field", lead: "帶領者在市場、漁港、潮間帶、廚房用的任務圖卡。" },
];
const LESSON = [
  ["第 1 節｜出發！海味小偵探", "認出 3 種在地水產品，理解吃在地、吃當季、吃適量"],
  ["第 2 節｜漁夫的秘密武器", "棒受網、延繩釣、籠具、一支釣與資源永續"],
  ["第 3 節｜零浪費海鮮廚房（上）", "觀察鮮度線索，在教師安全監督下完成低風險前處理"],
  ["第 4 節｜零浪費海鮮廚房（下）", "簡易低碳料理與學習單反思"],
  ["延伸第 5 節｜潮間帶與石花菜文化", "海邊也有一張餐桌"],
  ["延伸第 6 節｜家庭食魚任務", "把教室帶回餐桌"],
];

export default async function Materials() {
  const list = await getMaterials();
  return (
    <>
      <PageHero eyebrow="Materials" title="教材中心" lead="《八斗子食魚探索任務圖卡與學習手冊》：大字、圖像、任務化，可以用說、畫、勾、指、貼完成。" img={await resolveImage("0919-kitchen-lesson")} />
      <Crumbs items={[{ label: "教材中心" }]} />
      <nav aria-label="教材分類" className="wrap pt-8"><ul className="flex flex-wrap gap-2">{GROUPS.map((g) => <li key={g.key}><a href={`#${g.id}`} className="btn-line text-sm">{g.key}</a></li>)}</ul></nav>
      {GROUPS.map((g) => (
        <section key={g.key} id={g.id} className="wrap py-10" aria-labelledby={`h-${g.id}`}>
          <h2 id={`h-${g.id}`} className="text-2xl">{g.key}</h2>
          <p className="mt-1 text-ink-soft">{g.lead}</p>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {list.filter((m) => m.category === g.key).map((m) => (
              <li key={m.slug} id={m.slug} className="card flex gap-4 p-5">
                {m.previewImage ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={asset(m.previewImage)} alt="" width={88} height={124} loading="lazy" className="h-32 w-[5.5rem] shrink-0 rounded-md object-cover ring-1 ring-abyss/10" />
                  : <span className="grid h-32 w-[5.5rem] shrink-0 place-items-center rounded-md bg-harbor-100 text-harbor-600" aria-hidden="true"><Icon name="book" className="h-8 w-8" /></span>}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg leading-snug">{m.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{m.description}</p>
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                    {m.audience && <div className="flex gap-1"><dt>適用：</dt><dd>{m.audience}</dd></div>}
                    {m.printSize && <div className="flex gap-1"><dt>列印：</dt><dd>{m.printSize}</dd></div>}
                    {m.version && <div className="flex gap-1"><dt>版本：</dt><dd>{m.version}</dd></div>}
                    {m.updatedAt && <div className="flex gap-1"><dt>更新：</dt><dd>{m.updatedAt}</dd></div>}
                  </dl>
                  {m.pdfUrl && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={asset(m.pdfUrl)} target="_blank" rel="noopener" className="btn-line text-sm">線上預覽<span className="sr-only">：{m.title}（PDF，另開視窗）</span></a>
                      <a href={asset(m.pdfUrl.split("#")[0])} download className="btn-primary text-sm"><Icon name="download" className="h-4 w-4" />下載 PDF<span className="sr-only">：{m.title}</span></a>
                    </div>
                  )}
                  {m.slug === "lesson-plan" && (
                    <ol className="mt-4 space-y-2 text-sm">
                      {LESSON.map(([t, d], i) => <li key={t} className="flex gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-abyss text-xs font-bold text-white">{i + 1}</span><span><strong className="text-abyss">{t}</strong>：{d}</span></li>)}
                    </ol>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
