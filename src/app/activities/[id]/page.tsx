import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms";
import { formatDate, lineUrl, mediaMap, registrationOpen } from "@/lib/view";
import { StatusBadge, TypeChips } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Callout, LineCta, SafetyNote } from "@/components/ui";

export const revalidate = 300;

export async function generateStaticParams() {
  const c = await getContent();
  return c.activities.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await getContent();
  const a = c.activities.find((x) => x.id === id);
  if (!a) return {};
  const cover = a.coverId ? mediaMap(c).get(a.coverId) : c.media.find((m) => m.activityId === a.id);
  const title = `${a.name}（${formatDate(a.date).roc}）`;
  return {
    title,
    description: a.intro,
    alternates: { canonical: `/activities/${a.id}/` },
    openGraph: { title, description: a.intro, type: "article", images: cover ? [{ url: cover.src, alt: cover.alt }] : undefined },
  };
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
  const mm = mediaMap(c);
  const cover = a.coverId ? mm.get(a.coverId) : undefined;
  const photos = c.media.filter((m) => m.activityId === a.id && m.kind === "照片");
  const story = c.stories.find((s) => s.activityId === a.id);
  const storyCover = story?.coverId ? mm.get(story.coverId) : undefined;
  const blocks = c.activityBlocks.filter((b) => b.activityId === a.id);
  const narrative = blocks.filter((b) => b.kind !== "參與與回饋");
  const record = blocks.filter((b) => b.kind === "參與與回饋");
  // 圖文交錯：每段文字搭一張不重複的照片
  const sidePhotos = photos.filter((m) => m.id !== cover?.id);
  const open = registrationOpen(a);
  const idx = c.activities.findIndex((x) => x.id === a.id);
  const prev = c.activities[idx - 1];
  const next = c.activities[idx + 1];
  const training = a.types.includes("專業培訓");

  const facts = [
    { k: "日期", v: d.full },
    { k: "時段", v: a.slot || [a.startTime, a.endTime].filter(Boolean).join("–") },
    { k: "地點", v: a.location },
    { k: "對象", v: a.audience },
    { k: "名額", v: a.capacity },
    { k: "費用", v: a.fee },
  ].filter((f) => f.v);

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-deep text-shallow">
        {cover ? (
          <>
            <div className="absolute inset-0 -z-10"><Photo m={cover} className="h-full w-full" sizes="100vw" priority /></div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-900/95 via-deep-900/50 to-deep-900/20" />
          </>
        ) : null}
        <div className={`container-page flex flex-col justify-end py-12 sm:py-16 ${cover ? "min-h-[56svh]" : ""}`}>
          <nav aria-label="麵包屑" className="text-sm text-white/80">
            <Link href="/activities" className="underline-offset-4 hover:underline">活動與報名</Link> ／ {past ? `${a.year}年度活動回顧` : "活動詳情"}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={a.status} /><TypeChips types={a.types} /></div>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight !text-white sm:text-5xl">{a.name}</h1>
          <p className="mt-3 text-lg text-white/90">{[d.full, a.location].filter(Boolean).join("｜")}</p>
          {past && (a.headcount || a.slot) ? (
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-white">
              {a.headcount ? (
                <div><dt className="text-sm text-shallow">保險名冊</dt><dd className="text-3xl font-black">{a.headcount}<span className="ml-1 text-base font-bold text-sand">人次</span></dd></div>
              ) : null}
              {a.slot ? <div><dt className="text-sm text-shallow">時段</dt><dd className="text-3xl font-black">{a.slot}</dd></div> : null}
              {photos.length ? <div><dt className="text-sm text-shallow">活動照片</dt><dd className="text-3xl font-black">{photos.length}<span className="ml-1 text-base font-bold text-sand">張</span></dd></div> : null}
            </dl>
          ) : null}
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-12">
          {a.noticeType && a.noticeType !== "正常辦理" && a.notice ? (
            <Callout kind={NOTICE_KIND[a.noticeType] ?? "warn"} title={`活動異動：${a.noticeType}`}>
              <p>{a.notice}</p>
              <p className="mt-1 font-semibold">重大異動以主辦單位 LINE 或電話通知為準，網站公告不取代個別通知。</p>
            </Callout>
          ) : null}

          <section>
            <p className="text-xl leading-9 text-ink sm:text-[22px] sm:leading-10">{a.intro || "活動內容依主辦單位公告。"}</p>
          </section>

          {narrative.length ? (
            <section aria-label="活動現場紀錄" className="space-y-10">
              {narrative.map((b, i) => {
                const m = sidePhotos[i];
                return (
                  <div key={b.title} className={`grid items-center gap-6 ${m ? "md:grid-cols-2" : ""}`}>
                    {m ? <Photo m={m} className={`aspect-[4/3] rounded-3xl ${i % 2 ? "md:order-2" : ""}`} sizes="(max-width: 768px) 100vw, 40vw" /> : null}
                    <div>
                      <p className="eyebrow">{b.kind}</p>
                      <h2 className="mt-1 text-2xl font-black">{b.title}</h2>
                      <p className="mt-3 whitespace-pre-line text-[17px] leading-8">{b.body}</p>
                    </div>
                  </div>
                );
              })}
            </section>
          ) : null}

          {record.length || (past && a.result) ? (
            <section className="rounded-3xl bg-shallow-50 p-6 ring-1 ring-teal/20 sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-black"><Icon name="chart" className="h-5 w-5 text-teal" />{training ? "培訓紀錄" : "參與紀錄"}</h2>
              {record.map((b) => <p key={b.title} className="mt-3 text-[16px] leading-8">{b.body}</p>)}
              {!record.length && a.result ? <p className="mt-3 text-[16px] leading-8">{a.result}</p> : null}
              <Link href={`/results/${a.year}#timeline`} className="mt-4 inline-flex items-center gap-1 font-bold text-teal hover:text-deep">在{a.year}年度成果館看這一天<Icon name="arrow" className="h-4 w-4" /></Link>
            </section>
          ) : null}

          {photos.length ? (
            <section>
              <h2 className="text-2xl font-black">活動照片</h2>
              <p className="mt-1 text-sm text-ink-soft">點照片放大，可左右滑動或用方向鍵切換。</p>
              <div className="mt-4"><Gallery items={photos.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權", date: m.date }))} /></div>
            </section>
          ) : null}

          {story ? (
            <Link href={`/stories/${story.id}`} className="group grid overflow-hidden rounded-3xl bg-deep text-white sm:grid-cols-[1fr_1.2fr]">
              <div className="relative min-h-[180px]">{storyCover ? <Photo m={storyCover} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 40vw" /> : null}</div>
              <div className="p-6 sm:p-8">
                <p className="eyebrow !text-sand">OCEAN STORY</p>
                <p className="mt-2 text-2xl font-black leading-snug">{story.title}</p>
                {story.summary ? <p className="mt-2 text-white/80">{story.summary}</p> : null}
                <span className="mt-4 inline-flex items-center gap-1 font-bold text-sand">閱讀這場活動的故事<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ) : null}

          {!past ? (
            <section>
              <h2 className="text-2xl font-black">行前須知</h2>
              <dl className="mt-4 grid gap-4">
                {a.meeting ? <div className="card p-5"><dt className="font-bold text-deep">集合資訊</dt><dd className="mt-1">{a.meeting}</dd></div> : null}
                {a.gear ? <div className="card p-5"><dt className="font-bold text-deep">裝備與行前須知</dt><dd className="mt-1 whitespace-pre-line">{a.gear}</dd></div> : null}
                {a.safety ? <div className="card p-5"><dt className="font-bold text-deep">安全注意事項</dt><dd className="mt-1 whitespace-pre-line">{a.safety}</dd></div> : null}
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/prepare" className="btn-teal">行前準備清單<Icon name="arrow" className="h-4 w-4" /></Link>
                <Link href="/safety" className="btn-outline text-deep">安全教育練習</Link>
                <Link href="/fitness" className="btn-outline text-deep">科技體適能流程</Link>
              </div>
            </section>
          ) : null}

          <SafetyNote />

          <nav aria-label="其他活動" className="grid gap-3 border-t border-deep/10 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/activities/${prev.id}`} className="group rounded-2xl p-4 ring-1 ring-deep/10 hover:ring-teal">
                <span className="text-sm text-ink-soft">← 上一場｜{formatDate(prev.date).full}</span>
                <span className="mt-1 block font-bold text-deep group-hover:text-teal">{prev.name}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/activities/${next.id}`} className="group rounded-2xl p-4 text-right ring-1 ring-deep/10 hover:ring-teal">
                <span className="text-sm text-ink-soft">下一場｜{formatDate(next.date).full} →</span>
                <span className="mt-1 block font-bold text-deep group-hover:text-teal">{next.name}</span>
              </Link>
            ) : null}
          </nav>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <dl className="divide-y divide-deep/10">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-4 py-2.5 text-[15px]"><dt className="shrink-0 text-ink-soft">{f.k}</dt><dd className="text-right font-semibold text-deep">{f.v}</dd></div>
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
              {past ? <Link href="/activities" className="btn-outline text-deep">看即將舉行的活動</Link> : <LineCta url={line} />}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
