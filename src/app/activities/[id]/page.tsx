import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms";
import { formatDate, lineUrl, registrationOpen } from "@/lib/view";
import { StatusBadge, TypeChips } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Callout, LineCta } from "@/components/ui";

export const revalidate = 300;

export async function generateStaticParams() {
  const c = await getContent();
  return c.activities.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await getContent();
  const a = c.activities.find((x) => x.id === id);
  return a ? { title: `${a.name}（${formatDate(a.date).roc}）`, description: a.intro } : {};
}

const NOTICE_KIND: Record<string, "warn" | "safety" | "info"> = { 調整場地: "warn", 延期: "warn", 取消: "safety", 正常辦理: "info", 一般: "info" };

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getContent();
  const a = c.activities.find((x) => x.id === id);
  if (!a) notFound();
  const d = formatDate(a.date);
  const line = lineUrl(c);
  const past = a.status === "已完成";
  const photos = c.media.filter((m) => m.activityId === a.id && m.kind === "照片");
  const story = c.stories.find((s) => s.activityId === a.id);
  const blocks = c.activityBlocks.filter((b) => b.activityId === a.id);
  const open = registrationOpen(a);

  const facts = [
    { k: "日期", v: d.full },
    { k: "時段", v: a.slot || [a.startTime, a.endTime].filter(Boolean).join("–") },
    { k: "地點", v: a.location },
    { k: "適合對象", v: a.audience },
    { k: "名額", v: a.capacity },
    { k: "費用", v: a.fee },
  ].filter((f) => f.v);

  return (
    <article>
      <header className="bg-deep text-shallow">
        <div className="container-page py-12 sm:py-16">
          <nav aria-label="麵包屑" className="text-sm"><Link href="/activities" className="underline-offset-4 hover:underline">活動與報名</Link> ／ {past ? `${a.year}年度活動回顧` : "活動詳情"}</nav>
          <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={a.status} /><TypeChips types={a.types} /></div>
          <h1 className="mt-3 text-3xl font-black !text-white sm:text-5xl">{a.name}</h1>
          <p className="mt-3 text-lg">{d.full}｜{a.location || "地點依公告"}</p>
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {a.noticeType && a.noticeType !== "正常辦理" && a.notice ? (
            <Callout kind={NOTICE_KIND[a.noticeType] ?? "warn"} title={`活動異動：${a.noticeType}`}>
              <p>{a.notice}</p>
              <p className="mt-1 font-semibold">重大異動以主辦單位 LINE 或電話通知為準，網站公告不取代個別通知。</p>
            </Callout>
          ) : null}

          <section>
            <h2 className="text-2xl font-black">活動簡介</h2>
            <p className="mt-3 text-[17px]">{a.intro || "活動內容依主辦單位公告。"}</p>
            {past && a.result ? (
              <p className="mt-4 rounded-xl bg-shallow-50 p-4 font-semibold text-deep ring-1 ring-teal/20">活動成果：{a.result}</p>
            ) : null}
            {story ? (
              <Link href={`/stories/${story.id}`} className="mt-4 inline-flex items-center gap-1 font-bold text-teal hover:text-deep">
                閱讀這場活動的故事：{story.title}<Icon name="arrow" className="h-4 w-4" />
              </Link>
            ) : null}
          </section>

          {photos.length ? (
            <section>
              <h2 className="text-2xl font-black">活動照片</h2>
              <div className="mt-4"><Gallery items={photos.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權" }))} /></div>
            </section>
          ) : null}

          {!past ? (
            <section>
              <h2 className="text-2xl font-black">行前須知</h2>
              <dl className="mt-4 grid gap-4">
                {a.meeting ? <div className="card p-5"><dt className="font-bold text-deep">集合資訊</dt><dd className="mt-1">{a.meeting}</dd></div> : null}
                {a.gear ? <div className="card p-5"><dt className="font-bold text-deep">裝備與行前須知</dt><dd className="mt-1 whitespace-pre-line">{a.gear}</dd></div> : null}
                {a.safety ? <div className="card p-5"><dt className="font-bold text-deep">安全注意事項</dt><dd className="mt-1 whitespace-pre-line">{a.safety}</dd></div> : null}
                {blocks.map((b) => <div key={b.title} className="card p-5"><dt className="font-bold text-deep">{b.title}</dt><dd className="mt-1 whitespace-pre-line">{b.body}</dd></div>)}
              </dl>
              <Link href="/prepare" className="mt-4 inline-flex items-center gap-1 font-bold text-teal">完整行前準備清單<Icon name="arrow" className="h-4 w-4" /></Link>
            </section>
          ) : null}

          <Callout kind="safety" title="安全提醒">
            水域活動是否進行，由專業人員整合當日海況、場域、參與者狀態及相關規範判斷，必要時調整內容、改場、延期或取消。身體不適請在報到時主動告知教練。
          </Callout>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <dl className="divide-y divide-deep/10">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-4 py-2.5 text-[15px]"><dt className="text-ink-soft">{f.k}</dt><dd className="text-right font-semibold text-deep">{f.v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 grid gap-2">
              {open ? (
                <a href={a.formUrl} target="_blank" rel="noopener noreferrer" className="btn-teal w-full">
                  {a.status === "候補" ? "登記候補" : "前往正式報名表單"}<Icon name="external" className="h-4 w-4" />
                </a>
              ) : (
                <p className="rounded-xl bg-slate-50 p-3 text-center text-sm font-semibold text-ink-soft">
                  {past ? "本活動已完成" : a.status === "規劃中" ? "報名尚未開放" : "目前不開放報名"}
                </p>
              )}
              <LineCta url={line} />
              {!past ? <Link href="/prepare" className="btn-outline text-deep">行前準備清單</Link> : null}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
