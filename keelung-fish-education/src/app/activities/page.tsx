import { activityCards, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";
import { ActivityBrowser } from "@/components/Filter";

export async function generateMetadata() {
  const img = await resolveImage("0919-group-banner");
  return meta({ title: "活動", description: "潮境共學歷年食魚教育活動：體驗活動、校園課程、共融活動。", path: "/activities/", image: img?.src });
}
export default async function Activities() {
  const items = await activityCards();
  return (
    <>
      <PageHero title="活動" lead="從八斗子市場、漁港、潮間帶到生態廚房的每一場活動。" img={await resolveImage("0919-group-banner")} />
      <Crumbs items={[{ label: "活動" }]} />
      <div className="wrap py-10"><ActivityBrowser items={items} /></div>
    </>
  );
}
