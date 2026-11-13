import { resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";
import { Missions } from "@/components/Missions";

export async function generateMetadata() {
  const img = await resolveImage("0816-fish-id");
  return meta({ title: "親子任務：八斗子海味小偵探", description: "手機打開就能玩的四關任務：海鮮偵探、漁法配對、潮間帶觀察家、海味料理家。不需登入、不收集個資。", path: "/missions/", image: img?.src });
}
export default async function MissionsPage() {
  return (
    <>
      <PageHero title="八斗子海味小偵探" lead="市場、漁港、潮間帶、餐桌各一關，完成四關可獲得數位完成卡。" img={await resolveImage("0816-fish-id")} />
      <Crumbs items={[{ label: "親子任務" }]} />
      <div className="wrap max-w-3xl py-10">
        <Missions />
      </div>
    </>
  );
}
