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
      <PageHero eyebrow="Missions" title="八斗子海味小偵探" lead="四個任務，市場、漁港、潮間帶、餐桌各一關。不需要登入，進度只存在你的手機上。" img={await resolveImage("0816-fish-id")} />
      <Crumbs items={[{ label: "親子任務" }]} />
      <div className="wrap max-w-3xl py-10">
        <p className="mb-6 rounded-2xl bg-harbor-50 p-4 text-[15px]">家長小提醒：這裡不會要求姓名、電話，也沒有排行榜。現場活動時掃描 QR Code 即可進入本頁。</p>
        <Missions />
      </div>
    </>
  );
}
