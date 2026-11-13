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
      <PageHero title="這條魚是怎麼被捕到的？" lead="認識不同漁法的作業方式、捕撈對象與混獲情形，作為選購海鮮時的參考。" img={await resolveImage("0919-squid-boat")} />
      <Crumbs items={[{ label: "漁法圖鑑" }]} />
      <div className="wrap py-10">
        <ul className="grid gap-6 sm:grid-cols-2">
          {list.map((m, i) => <li key={m.slug}><TileCard href={`/fishing-methods/${m.slug}/`} title={m.name} body={m.description} img={imgs[i]} /></li>)}
        </ul>
      </div>
    </>
  );
}
