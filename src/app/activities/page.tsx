import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { lineUrl, splitList, todayTaipei, mediaMap } from "@/lib/view";
import { ActivityBrowser, type ActivityLite } from "@/components/ActivityBrowser";
import { Callout, LineCta, PageHero } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "海洋活動與報名", description: "SUP、浮潛、親子、共融海洋活動日曆、報名與活動回顧。", alternates: { canonical: "/activities/" } };

export default async function ActivitiesPage() {
  const c = await getContent();
  const mm = mediaMap(c);
  const items: ActivityLite[] = c.activities.map((a) => {
    const cover = a.coverId ? mm.get(a.coverId) : undefined;
    return {
      id: a.id, year: a.year, name: a.name, types: splitList(a.types), date: a.date, slot: a.slot,
      location: a.location, status: a.status, result: a.result,
      cover: cover ? { src: cover.src, alt: cover.alt, pending: cover.consent !== "已授權" } : undefined,
    };
  });
  const hasUpcoming = items.some((a) => a.status !== "已完成" && a.date >= todayTaipei());
  return (
    <>
      <PageHero eyebrow="ACTIVITIES & SIGN-UP" title="海洋活動與報名" lead="查看活動日曆、報名狀態與行前須知。已完成的活動保留為年度活動回顧。">
        <div className="mt-6"><LineCta url={lineUrl(c)} /></div>
      </PageHero>
      <div className="container-page py-12">
        {!hasUpcoming ? (
          <div className="mb-8">
            <Callout title="新一季活動規劃中">
              目前沒有開放報名的活動。以下為115年度活動回顧；新活動公告後會出現在這裡，並同步透過官方LINE通知。
            </Callout>
          </div>
        ) : null}
        <ActivityBrowser items={items} today={todayTaipei()} />
        <div className="mt-10">
          <Callout kind="warn" title="報名須知">
            報名請使用活動頁提供的正式報名表單。報名完成不代表已錄取或可下水；實際出席、下水與分組以主辦單位通知、報到檢測與教練判斷為準。
          </Callout>
        </div>
      </div>
    </>
  );
}
