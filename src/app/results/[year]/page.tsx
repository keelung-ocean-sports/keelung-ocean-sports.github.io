import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms";
import { achievement, formatDate, link, mediaByUsage, parsePartners, pickMedia, splitList, yearRow } from "@/lib/view";
import { KpiDashboard, type KpiLite } from "@/components/KpiDashboard";
import { StoryCard } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Callout, Empty, SectionTitle } from "@/components/ui";

export const revalidate = 300;

export async function generateStaticParams() {
  const c = await getContent();
  return c.years.map((y) => ({ year: y.year }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return { title: `${year}年度成果館`, description: `${year}年度活動歷程、照片故事、安全教育、共融與 KPI 成果。` };
}

const FLOW = ["計畫核定及啟動", "民眾認識與報名", "行前安全教育", "科技體適能", "實際海洋活動", "回饋及觀察", "會員回流", "年度成果"];
const SUBNAV = [
  ["timeline", "年度歷程"],
  ["gallery", "照片故事"],
  ["safety", "安全・體適能・培力"],
  ["inclusion", "共融・觀察・回饋"],
  ["kpi", "KPI 與查核索引"],
];

function Bar({ label, value, max, suffix, note, display }: { label: string; value: number; max: number; suffix: string; note?: string; display?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[15px]">
        <span className="font-semibold text-deep">{label}</span>
        <span className="shrink-0 font-black text-teal">{display ?? value}{suffix}{note ? <span className="ml-1 text-xs font-semibold text-ink-soft">{note}</span> : null}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-shallow/40" aria-hidden>
        <div className="h-full rounded-full bg-gradient-to-r from-teal to-deep" style={{ width: `${Math.max(2, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const c = await getContent();
  const y = yearRow(c, year);
  if (!y) notFound();

  const acts = c.activities.filter((a) => a.year === year);
  const actById = new Map(acts.map((a) => [a.id, a]));
  const kpis = c.kpis.filter((k) => k.year === year);
  const core = kpis.filter((k) => k.category === "核定KPI");
  const stats = kpis.filter((k) => k.category === "統計指標" && k.confirm === "已列報");
  const fb = c.feedback.filter((f) => f.year === year);
  const stories = c.stories.filter((s) => s.year === year);
  const featured = mediaByUsage(c, "年度精選").filter((m) => m.year === year);
  const yearPhotos = c.media.filter((m) => m.year === year && m.kind === "照片" && m.activityId);
  const video = link(c, `result_video_${year}`);
  const kpi = (id: string) => kpis.find((k) => k.id === id);
  const partners = parsePartners(y.partners);
  const operatorLogo = c.settings.operator_logo || "/brand/chaojing-association-logo.png";

  // 年度歷程：里程碑＋活動，依日期排序
  const timeline = [
    ...c.milestones.filter((m) => m.year === year).map((m) => ({ date: m.date, label: m.dateLabel || formatDate(m.date).roc, stage: m.stage, title: m.title, body: m.description, href: undefined as string | undefined, source: m.source })),
    ...acts.map((a) => ({
      date: a.date,
      label: formatDate(a.date).roc,
      stage: a.types.includes("專業培訓") ? "專業培力" : "實際海洋活動",
      title: a.location ? `${a.name}｜${a.location}` : a.name,
      body: a.result,
      href: `/activities/${a.id}`,
      source: "",
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const rosterDays = acts.filter((a) => a.headcount);
  const rosterMax = Math.max(...rosterDays.map((a) => Number(a.headcount)), 1);
  const rosterSum = rosterDays.reduce((s, a) => s + Number(a.headcount), 0);

  const toLite = (k: (typeof kpis)[number]): KpiLite => ({
    id: k.id, name: k.name, target: k.target, targetUnit: k.targetUnit, actual: k.actual, actualUnit: k.actualUnit,
    actualNote: k.actualNote, period: k.period, method: k.method, execution: k.execution, evidence: k.evidence,
    confirm: k.confirm, rate: achievement(k.target, k.actual), feedback: k.feedback, note: k.note,
    activities: splitList(k.activityIds).map((id) => actById.get(id)).filter(Boolean).map((a) => ({ id: a!.id, label: `${formatDate(a!.date).md} ${a!.name.replace(/（.*?）/g, "")}` })),
    photos: pickMedia(c, splitList(k.photoIds)).map((m) => ({ id: m.id, src: m.src, alt: m.alt, pending: m.consent !== "已授權" })),
  });

  const sat = fb.filter((f) => f.kind === "滿意度題項");
  const learn = fb.filter((f) => f.kind === "學習成效");
  const obs = fb.filter((f) => f.kind === "海洋觀察");
  const quiz = fb.filter((f) => f.kind === "安全測驗");
  const improve = fb.filter((f) => f.kind === "改善追蹤");
  const inclusionStories = stories.filter((s) => s.themes.includes("共融"));

  return (
    <>
      {/* 年度識別 */}
      <section className="bg-deep text-shallow">
        <div className="container-page py-12 sm:py-16">
          <nav aria-label="麵包屑" className="text-sm"><Link href="/results" className="hover:underline">年度成果館</Link> ／ {year}年度</nav>
          <p className="mt-6 text-sm font-bold tracking-[0.25em] text-sand">基隆海洋運動俱樂部｜{year}年度成果館</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight !text-white sm:text-5xl">{y.name}</h1>
          <p className="mt-3 text-lg">{y.program}</p>
          <p className="mt-1 text-[15px] text-shallow/80">執行期間：{y.period}｜統計截止：{y.cutoff}｜場域：{y.venue}</p>
        </div>
        <div className="bg-white text-ink">
          <div className="container-page flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="flex items-center gap-3">
              <Image src={operatorLogo} alt={`${y.executor}標誌`} width={832} height={725} className="h-14 w-auto" />
              <div className="text-sm leading-6"><span className="block text-ink-soft">執行單位</span><span className="font-bold text-deep">{y.executor}</span></div>
            </div>
            {y.sponsorLogo ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-soft">{y.sponsorLabel}</span>
                <Image src={y.sponsorLogo} alt={`${y.sponsor}標誌`} width={437} height={120} className="h-12 w-auto" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <nav aria-label="成果館分區" className="sticky top-16 z-30 border-b border-deep/10 bg-white/95 backdrop-blur">
        <ul className="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {SUBNAV.map(([id, l]) => (
            <li key={id} className="shrink-0"><a href={`#${id}`} className="inline-flex min-h-[40px] items-center rounded-full px-3 text-[15px] font-semibold text-deep hover:bg-shallow/40">{l}</a></li>
          ))}
        </ul>
      </nav>

      <div className="container-page pt-10">
        <Callout kind={y.dataStatus.includes("待") ? "warn" : "info"} title={`資料來源：${y.source}`}>
          {y.dataStatus ? <p>資料狀態：{y.dataStatus}。</p> : null}
          <p>「人次」是任務人次，不等於不重複人數；報名意願、回饋問卷份數不加入年度人次。{y.privacyNote}</p>
        </Callout>
        {y.summary ? <p className="mt-8 max-w-3xl text-lg leading-9">{y.summary}</p> : null}
      </div>

      {/* 1 年度完整活動歷程 */}
      <section id="timeline" className="container-page scroll-mt-32 py-16">
        <SectionTitle eyebrow="01 JOURNEY" title="年度完整活動歷程" lead="本頁為事後整理之年度執行歷程，不代表網站於活動期間即已上線。" />
        <ol className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold" aria-label="營運流程">
          {FLOW.map((f, i) => (
            <li key={f} className="flex items-center gap-2">
              <span className="rounded-full bg-shallow/40 px-3 py-1.5 text-deep">{f}</span>
              {i < FLOW.length - 1 ? <Icon name="arrow" className="h-4 w-4 text-teal" /> : null}
            </li>
          ))}
        </ol>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ol className="relative border-l-2 border-shallow pl-6">
            {timeline.map((t, i) => (
              <li key={i} className="relative mb-6">
                <span className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full ring-4 ring-white ${t.href ? "bg-teal" : "bg-sand-700"}`} aria-hidden />
                <p className="text-sm font-bold text-teal">{t.label}<span className="ml-2 rounded bg-shallow/40 px-1.5 py-0.5 text-xs text-deep">{t.stage}</span></p>
                <p className="mt-1 font-bold text-deep">{t.href ? <Link href={t.href} className="hover:text-teal hover:underline">{t.title}</Link> : t.title}</p>
                {t.body ? <p className="text-[15px] text-ink-soft">{t.body}</p> : null}
                {t.source ? <p className="text-xs text-ink-soft/80">來源：{t.source}</p> : null}
              </li>
            ))}
          </ol>
          {rosterDays.length ? (
            <div className="card h-fit p-6">
              <h3 className="text-lg font-bold">各活動日保險名冊人次</h3>
              <p className="text-sm text-ink-soft">同一人同一天只計一次；上下午共用日名冊。</p>
              <div className="mt-4 space-y-3">
                {rosterDays.map((a) => <Bar key={a.id} label={`${formatDate(a.date).md}${a.location.includes("福隆") ? "（福隆）" : ""}`} value={Number(a.headcount)} max={rosterMax} suffix="" />)}
              </div>
              <p className="mt-4 border-t border-deep/10 pt-3 text-right font-black text-deep">合計 {rosterSum} 人次</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* 2 年度精彩照片、故事及影音 */}
      <section id="gallery" className="scroll-mt-32 bg-sand-50 py-16">
        <div className="container-page">
          <SectionTitle eyebrow="02 MOMENTS" title="年度精彩照片、故事及影音" />
          {stories.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.slice(0, 6).map((s) => <StoryCard key={s.id} s={s} c={c} />)}
            </div>
          ) : null}
          <div className="mt-10">
            {yearPhotos.length ? (
              <Gallery columns="sm:grid-cols-3 lg:grid-cols-4" items={(featured.length >= 8 ? featured : yearPhotos).map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, pending: m.consent !== "已授權", meta: m.date ? formatDate(m.date).md : undefined }))} />
            ) : (
              <Empty>照片完成肖像授權確認後公開。</Empty>
            )}
          </div>
          <div className="mt-8">
            {video ? (
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-teal"><Icon name="play" className="h-4 w-4" />觀看{year}年度成果影片</a>
            ) : (
              <p className="text-[15px] text-ink-soft">{kpi("K11")?.confirm === "已列報" ? "年度成果影片已完成，公開播放連結待協會提供。" : "成果影片待補。"}</p>
            )}
          </div>
        </div>
      </section>

      {/* 3 安全教育、科技體適能與專業培力 */}
      <section id="safety" className="container-page scroll-mt-32 py-16">
        <SectionTitle eyebrow="03 SAFETY & TRAINING" title="安全教育、科技體適能與專業培力" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-bold">線上水域安全教育任務</h3>
            {kpi("S02") ? <p className="mt-1 text-[15px] text-ink-soft">{kpi("S02")!.actualNote}｜{kpi("S02")!.method}</p> : null}
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {quiz.map((q) => (
                <div key={q.id} className="rounded-xl bg-shallow-50 p-4">
                  <dt className="text-sm font-semibold text-ink-soft">{q.name}</dt>
                  <dd className="text-2xl font-black text-deep">{q.value}<span className="ml-1 text-sm font-bold text-teal">{q.unit}</span>{q.ratio && q.unit !== "%" && q.unit !== "／80分" ? <span className="ml-2 text-sm font-bold text-ink-soft">{q.ratio}</span> : null}</dd>
                  {q.note ? <dd className="text-xs text-ink-soft">{q.note}</dd> : null}
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6">
            {[kpi("K10"), kpi("K06")].filter(Boolean).map((k) => (
              <div key={k!.id} className="card p-6">
                <h3 className="text-lg font-bold">{k!.name}</h3>
                <p className="mt-2 text-4xl font-black text-deep">{k!.actual}<span className="ml-1 text-base font-bold text-teal">{k!.actualUnit}</span></p>
                <p className="text-sm text-ink-soft">目標 {k!.target} {k!.targetUnit}</p>
                <p className="mt-2 text-[15px]">{k!.actualNote}</p>
              </div>
            ))}
            <div className="card p-6">
              <h3 className="text-lg font-bold">人才培力（助教、救生、志工）</h3>
              <p className="mt-2 text-[15px] text-ink-soft">依期末報告，助教培育、救生員培訓與青年志工人數由協會另附名冊列報；網站在名冊統計確認前不公開數字。</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-soft">個別健康評量、檢測數值與安全分流資料不公開。</p>
      </section>

      {/* 4 親子共融、海洋公民觀察與回饋 */}
      <section id="inclusion" className="scroll-mt-32 bg-shallow-50 py-16">
        <div className="container-page">
          <SectionTitle eyebrow="04 INCLUSION & FEEDBACK" title="親子共融、海洋公民觀察與回饋" />
          {kpi("K09") ? (
            <div className="card mb-8 grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
              <div>
                <h3 className="text-lg font-bold">共融活動</h3>
                <p className="mt-2 text-4xl font-black text-deep">{kpi("K09")!.actual}<span className="ml-1 text-base font-bold text-teal">{kpi("K09")!.actualUnit}</span></p>
                <p className="mt-2 text-[15px]">{kpi("K09")!.actualNote}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {inclusionStories.map((s) => <StoryCard key={s.id} s={s} c={c} />)}
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {sat.length ? (
              <div className="card p-6">
                <h3 className="text-lg font-bold">活動後回饋（滿分 5 分）</h3>
                <p className="text-sm text-ink-soft">各題以有效回覆為分母；括號為 4–5 分比率。</p>
                <div className="mt-4 space-y-3">
                  {sat.map((s) => <Bar key={s.id} label={s.name} value={Number(s.value)} display={s.value} max={5} suffix="" note={`n=${s.base}（${s.ratio}）`} />)}
                </div>
              </div>
            ) : null}
            <div className="space-y-6">
              {obs.length ? (
                <div className="card p-6">
                  <h3 className="text-lg font-bold">海洋觀察與安全態度（96 份，可複選）</h3>
                  <div className="mt-4 space-y-3">
                    {obs.map((o) => <Bar key={o.id} label={o.name} value={Number(o.value)} max={Number(o.base) || 96} suffix=" 份" />)}
                  </div>
                </div>
              ) : null}
              {learn.length ? (
                <div className="card p-6">
                  <h3 className="text-lg font-bold">學習與回流意願</h3>
                  <div className="mt-4 space-y-3">
                    {learn.map((o) => <Bar key={o.id} label={o.name} value={Number(o.value)} max={Number(o.base) || 96} suffix=" 份" />)}
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">回流意願為問卷回覆，不等於正式會員人數。</p>
                </div>
              ) : null}
            </div>
          </div>

          {improve.length ? (
            <div className="card mt-8 overflow-hidden">
              <h3 className="p-6 pb-2 text-lg font-bold">改善追蹤</h3>
              <p className="px-6 text-sm text-ink-soft">意見來源 → 問題類型 → 規劃改善方式 → 改善狀態 → 佐證。狀態為「規劃中」者尚未實施。</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-[15px]">
                  <thead className="bg-deep text-white">
                    <tr><th className="p-3">問題類型</th><th className="p-3">意見來源</th><th className="p-3">規劃改善方式</th><th className="p-3">狀態</th><th className="p-3">佐證</th></tr>
                  </thead>
                  <tbody>
                    {improve.map((r) => (
                      <tr key={r.id} className="border-b border-deep/10 align-top">
                        <td className="p-3 font-bold text-deep">{r.issue || r.name}</td>
                        <td className="p-3">{r.note}</td>
                        <td className="p-3">{r.plan}</td>
                        <td className="p-3"><span className={`chip whitespace-nowrap text-xs ${r.status === "已完成" ? "bg-emerald-50 text-emerald-800 ring-emerald-300" : "bg-amber-50 text-amber-900 ring-amber-300"}`}>{r.status || "規劃中"}</span></td>
                        <td className="p-3 text-ink-soft">{r.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          <p className="mt-6 text-sm text-ink-soft">參與者個人心得將在取得原始回饋與公開同意後上架；本頁僅呈現去識別化統計。</p>
        </div>
      </section>

      {/* 5 KPI 儀表板與查核索引 */}
      <section id="kpi" className="container-page scroll-mt-32 py-16">
        <SectionTitle eyebrow="05 KPI & AUDIT INDEX" title="KPI 成果儀表板與查核索引" lead="點選任一指標，查看執行方法、計算基礎、相關活動、照片與佐證索引。" />
        {stats.length ? (
          <dl className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.id} className="rounded-2xl bg-deep p-4 text-white">
                <dt className="text-sm text-shallow">{s.name}</dt>
                <dd className="text-3xl font-black">{s.actual}<span className="ml-1 text-sm font-bold text-sand">{s.actualUnit}</span></dd>
                <dd className="text-xs text-shallow/80">{s.actualNote}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <KpiDashboard items={core.map(toLite)} />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-bold">統計方法與不重複加計原則</h3>
            <ul className="mt-3 space-y-2 text-[15px]">
              {[
                "年度任務人次 ＝ 實體活動保險名冊人次 ＋ 線上安全教育任務人次，兩者性質不同、分別計次。",
                "人次不等於不重複人數；同一人參加不同日期，分別計次。",
                "保險名冊同日證號去重；上下午共用日名冊，同一天只計一次。",
                "線上安全測驗以姓名及手機末三碼辨識重複作答，家長合填不另拆計。",
                "報名意願登記、滿意度問卷、原始測驗份數，均不加入年度人次。",
                "趣味競賽人次已含於名冊合計；專業培訓與體適能另列專項，不再加計。",
                "保險名冊為統計依據，現場出席以簽到紀錄核對。",
              ].map((t) => <li key={t} className="flex gap-2"><Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-teal" />{t}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-bold">佐證資料索引（去識別化）</h3>
            <p className="mt-1 text-sm text-ink-soft">以下列出佐證類型與範圍；原始資料含個資，不在網站公開。</p>
            <ul className="mt-3 divide-y divide-deep/10 text-[15px]">
              {kpis.filter((k) => k.evidence).map((k) => (
                <li key={k.id} className="py-2"><span className="font-bold text-deep">{k.name}</span>：{k.evidence}</li>
              ))}
            </ul>
            <Callout title="審查調閱">
              審查人員如需完整佐證（名冊、保險、簽到、測驗原始回覆、核銷憑證），請洽{y.executor}，由協會以具權限控管的雲端資料夾另行授權提供。
            </Callout>
          </div>
        </div>

        {partners.length ? (
          <div className="mt-12">
            <h3 className="text-lg font-bold">公私協力與在地合作</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {partners.map((p) => (
                <li key={p.name} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-deep/15">
                  {p.kind ? <span className="mr-1 text-sm text-ink-soft">{p.kind}</span> : null}<span className="font-semibold text-deep">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {y.budget ? <p className="mt-8 text-sm text-ink-soft">計畫經費：{y.budget}。期末實支以經費收支結算表為準。</p> : null}
      </section>
    </>
  );
}
