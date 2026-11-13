import { getStories, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { fmtDate } from "@/lib/site";
import { PageHero, Crumbs } from "@/components/ui";
import { TileCard } from "@/components/cards";

export async function generateMetadata() {
  const img = await resolveImage("0816-dishes-table");
  return meta({ title: "活動故事", description: "每一場食魚教育活動在哪裡、做了什麼、看到什麼，怎麼從海洋走到餐桌。", path: "/stories/", image: img?.src });
}
export default async function Stories() {
  const list = await getStories();
  const imgs = await Promise.all(list.map((s) => resolveImage(s.coverImage, s.title)));
  return (
    <>
      <PageHero eyebrow="Stories" title="活動故事" lead="不是流水帳。每篇只回答幾件事：為什麼辦、在哪裡、做了什麼、看到什麼、怎麼從海洋走到餐桌。" img={await resolveImage("0816-dishes-table")} />
      <Crumbs items={[{ label: "活動故事" }]} />
      <ul className="wrap grid gap-6 py-10 sm:grid-cols-2">
        {list.map((s, i) => <li key={s.slug}><TileCard href={`/stories/${s.slug}/`} title={s.title} tag={fmtDate(s.date)} body={s.summary} img={imgs[i]} /></li>)}
      </ul>
    </>
  );
}
