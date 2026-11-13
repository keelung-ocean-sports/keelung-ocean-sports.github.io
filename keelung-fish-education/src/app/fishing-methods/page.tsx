import { getMethods, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";
import { TileCard } from "@/components/cards";

export async function generateMetadata() {
  const img = await resolveImage("0919-squid-boat");
  return meta({ title: "漁法圖鑑", description: "棒受網、延繩釣、籠具、一支釣：漁具怎麼運作、捕什麼、選擇性與混獲，理解魚是怎麼被捕到的。", path: "/fishing-methods/", image: img?.src });
}

export default async function Methods() {
  const list = await getMethods();
  const imgs = await Promise.all(list.map((m) => resolveImage(m.coverImage, m.name)));
  return (
    <>
      <PageHero eyebrow="Fishing Methods" title="這條魚是怎麼被捕到的？" lead="漁法沒有簡單的好壞之分。看懂它怎麼運作、捕什麼、會不會捕到不要的，才能做出更好的選擇。" img={await resolveImage("0919-squid-boat")} />
      <Crumbs items={[{ label: "漁法圖鑑" }]} />
      <div className="wrap py-10">
        <ul className="grid gap-6 sm:grid-cols-2">
          {list.map((m, i) => <li key={m.slug}><TileCard href={`/fishing-methods/${m.slug}/`} title={m.name} body={m.description} img={imgs[i]} /></li>)}
        </ul>
        <section aria-labelledby="h-think" className="mt-12 rounded-3xl bg-harbor-50 p-6 sm:p-8">
          <h2 id="h-think" className="text-xl">看漁法的四個問題</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {["它怎麼運作？用什麼漁具？", "它主要捕什麼？", "會不會捕到不想要的生物（混獲）？", "對海底棲地、資源量有什麼影響？怎麼管理？"].map((q, i) => (
              <li key={q} className="flex gap-3 rounded-xl bg-white p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-abyss font-bold text-white">{i + 1}</span>{q}</li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
