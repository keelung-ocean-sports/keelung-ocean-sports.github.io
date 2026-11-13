import { getSpecies, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";
import { SpeciesBrowser } from "@/components/Filter";

const CATS = ["魚類", "頭足類", "蝦蟹類", "貝類", "海藻／石花菜", "水產加工品"];

export async function generateMetadata() {
  const img = await resolveImage("1017-market-fish");
  return meta({ title: "八斗子海味圖鑑", description: "鎖管、白帶魚、鯖魚、蝦、貝、石花菜：認識八斗子常見海味的外觀、鮮度、料理與永續選擇。", path: "/species/", image: img?.src });
}

export default async function SpeciesPage() {
  const list = await getSpecies();
  const items = await Promise.all(list.map(async (s) => ({ slug: s.slug, name: s.name, localName: s.localName, category: s.category, features: s.features, img: await resolveImage(s.coverImage, s.name) })));
  return (
    <>
      <PageHero title="今天市場有什麼魚？" lead="實際魚貨依季節與漁況變化，以下為活動中常見的海味。" img={await resolveImage("1017-market-fish")} />
      <Crumbs items={[{ label: "海味圖鑑" }]} />
      <div className="wrap py-10"><SpeciesBrowser items={items} categories={CATS} /></div>
    </>
  );
}
