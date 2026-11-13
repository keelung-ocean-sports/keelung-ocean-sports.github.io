import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { achievement, activeNotices, formatDate, isUpcoming, lineUrl, mediaByUsage, mediaMap, yearRow, programVisual } from "@/lib/view";
import { ActivityCard, StoryCard } from "@/components/cards";
import { CountUp } from "@/components/CountUp";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Quotes } from "@/components/Quotes";
import { Callout, LineCta, SectionTitle } from "@/components/ui";

export const revalidate = 300;

const THEMES = [
  // fallback：試算表沒有該主題的「主題封面」時使用的照片ID
  { key: "SUP", fallback: "M115-0802-sup-group", title: "SUP 立式划槳", text: "從岸上站姿、跪姿到板上划槳，教練陪你一步一步找到平衡。", href: "/activities?type=SUP入門體驗" },
  { key: "浮潛", fallback: "M115-0801-snorkel-observation", title: "浮潛親海", text: "穿好救生衣、戴上面鏡與呼吸管，看見外木山水面下的生命。", href: "/activities?type=浮潛親海體驗" },
  { key: "親子", fallback: "M115-0816-training-banner", title: "親子海洋運動", text: "大人小孩一起認識海、一起練習安全，把親海變成家庭日常。", href: "/activities?type=親子海洋運動" },
  { key: "共融", fallback: "M115-1004-fulong-sup-group", title: "共融及適應性活動", text: "與社福團體合作，調整節奏與陪同人力，讓更多人有機會下水。", href: "/activities?type=共融及適應性海洋活動" },
];

const PATHWAY = ["海洋運動入門", "安全教育", "常態運動", "海洋觀察", "志工培力", "助教", "進階訓練"];

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const hero = mediaByUsage(c, "首頁主視覺")[0];
  return {
    alternates: { canonical: "/" },
    openGraph: hero ? { images: [{ url: hero.src, alt: hero.alt }] } : undefined,
  };
}

export default async function HomePage() {
  const c = await getContent();
  const mm = mediaMap(c);
  const line = lineUrl(c);
  const hero = mediaByUsage(c, "首頁主視覺")[0];
  const y115 = yearRow(c, "115");
  const upcoming = c.activities.filter((a) => isUpcoming(a));
  const recent = [...c.activities].filter((a) => a.status === "已完成" && a.coverId).reverse().slice(0, 6);
  const notices = activeNotices(c);
  const stories = [...c.stories].reverse();
  const quotes = c.feedback.filter((f) => f.kind === "參與者心得").slice(0, 3);
  const kpi = (id: string) => c.kpis.find((k) => k.year === "115" && k.id === id && k.confirm === "已列報" && k.actual);
  const k01 = kpi("K01");
  const resultsBg = mediaByUsage(c, "成果館主視覺")[0] ?? mediaByUsage(c, "年度精選")[0];
  const ideaPhoto = mm.get("M115-0802-am-safety-briefing") ?? mediaByUsage(c, "安全教育")[0];
  const safetyPhoto = mm.get("M115-0801-am-tent-briefing") ?? mediaByUsage(c, "安全教育")[1];
  const mosaic = mediaByUsage(c, "年度精選").filter((m) => m.id !== hero?.id).slice(0, 5);

  const stats = [
    { k: kpi("S01"), label: "實體活動投保人次", note: "9 個投保活動日；另有 3 場培訓" },
    { k: kpi("S07"), label: "官方LINE累積好友", note: "依協會提供截圖；不計入活動人次" },
    { k: kpi("K10"), label: "科技體適能檢測", note: (k: string) => `下水前完成檢測｜目標 ${k} 人次` },
    { k: kpi("S02"), label: "線上安全教育", note: "223 份作答，去重後計次" },
    { k: kpi("S04"), label: "整體滿意度", note: "96 份活動後回饋，滿分 5 分" },
  ].filter((s) => s.k);

  return (
    <>
      {/* 1–2 主視覺、名稱標語、主要行動 */}
      <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-deep text-white">
        {hero ? (
          <div className="absolute inset-0 -z-10 animate-kenburns">
            <Photo m={hero} className="h-full w-full [&_img]:object-[50%_60%]" sizes="100vw" priority />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_10%,#1a8f99_0%,#0B3C49_55%,#072a33_100%)]" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-900/95 via-deep-900/35 to-transparent" />
        <div className="absolute inset-y-0 left-0 -z-10 w-full bg-gradient-to-r from-deep-900/70 to-transparent sm:w-2/3" />
        <div className="container-page pb-12 pt-32 sm:pb-20">
          <p className="animate-rise text-xs font-bold tracking-[0.3em] text-shallow sm:text-sm">KEELUNG OCEAN SPORTS CLUB</p>
          <h1 className="animate-rise mt-3 text-[38px] font-black leading-[1.1] !text-white min-[400px]:text-[42px] sm:text-6xl lg:text-7xl">
            基隆海洋運動俱樂部
          </h1>
          <p className="animate-rise-delay mt-4 text-2xl font-bold text-sand sm:text-3xl">{c.settings.slogan || "一起去海邊運動吧！"}</p>
          <p className="animate-rise-delay mt-4 max-w-xl text-[17px] leading-8 text-white/90">
            在基隆外木山的海岸，從岸上認識裝備、練習動作，再由教練帶你安全下水。SUP、浮潛、親子與共融，每個人都有適合自己的第一步。
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            <Link href="/activities" className="btn-primary"><Icon name="calendar" />探索海洋活動</Link>
            {y115 ? <Link href={`/results/${y115.year}`} className="btn-outline text-white"><Icon name="chart" />{y115.year}年度精彩成果</Link> : null}
          </div>
          {hero ? <p className="mt-10 text-[12px] text-white/60">照片：{hero.date ? `${formatDate(hero.date).full}｜` : ""}{hero.caption || hero.alt}</p> : null}
        </div>
      </section>

      {/* 3 115年度補助單位獨立識別區（僅限 115 年度計畫） */}
      {y115 ? (
        <section aria-labelledby="sponsor-115" className="border-b border-deep/10 bg-white">
          <div className="container-page flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {y115.sponsorLogo ? (
                <Image src={y115.sponsorLogo} alt={`${y115.sponsor}標誌`} width={437} height={120} className="h-auto w-[200px] sm:w-[240px]" />
              ) : null}
              {programVisual(y115.year) ? (
                <Image src={programVisual(y115.year)!.src} alt={programVisual(y115.year)!.alt} width={programVisual(y115.year)!.w} height={programVisual(y115.year)!.h} className="h-20 w-auto sm:h-24" />
              ) : null}
            </div>
            <div className="md:max-w-xl">
              <p id="sponsor-115" className="text-sm font-bold text-teal">{y115.year}年度{y115.sponsorLabel || "指導／補助單位"}：{y115.sponsor}</p>
              <p className="mt-1 text-[15px] leading-7 text-ink">
                {y115.program}
                <br />
                <span className="font-bold text-deep">{y115.name}</span>
              </p>
            </div>
            <Link href={`/results/${y115.year}`} className="btn-teal shrink-0">看{y115.year}年度成果館<Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </section>
      ) : null}

      {notices.length ? (
        <section className="container-page mt-10 space-y-3" aria-label="網站公告">
          {notices.map((n) => (
            <Callout key={n.id} kind={n.kind === "一般" || n.kind === "正常辦理" ? "info" : "warn"} title={`${n.kind !== "一般" ? `【${n.kind}】` : ""}${n.title}`}>
              <p>{n.body}</p>
              {n.kind !== "一般" ? <p className="mt-1 text-sm">活動異動以主辦單位 LINE 或電話通知為準。</p> : null}
            </Callout>
          ))}
        </section>
      ) : null}

      {/* 4 理念與在地海洋：編輯式左右排版 */}
      <section className="container-page grid items-center gap-10 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="relative">
          {ideaPhoto ? <Photo m={ideaPhoto} className="aspect-[4/3] rounded-[2rem] shadow-2xl shadow-deep/20" sizes="(max-width: 1024px) 100vw, 55vw" /> : null}
          <p className="absolute -bottom-5 right-4 max-w-[78%] rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-deep shadow-lg sm:right-8">
            下水前，先把安全說清楚：每一場都從帳篷下的行前說明開始。
          </p>
        </div>
        <div>
          <p className="eyebrow">OUR WAY</p>
          <h2 className="mt-2 text-[28px] font-black leading-tight sm:text-[38px]">讓海洋運動，<br className="sm:hidden" />成為基隆人的日常</h2>
          <p className="mt-4 text-[17px] leading-8 text-ink-soft">
            {c.settings.tagline_long || "外木山海興有消波塊圍出的入水區，天氣好時能遠望基隆嶼。我們把這片海變成社區的運動場。"}
          </p>
          <ol className="mt-8 space-y-6">
            {[
              { t: "安全是第一堂課", d: "下水前完成安全教育、科技體適能報到與裝備確認；海況由教練做 Go／No-Go 判斷。" },
              { t: "人與海洋共存", d: "在運動中觀察海岸、海洋生物與海漂垃圾，把親海的感動變成守護海洋的行動。" },
              { t: "每個人都能參與", d: "親子家庭、社區長者、身心障礙夥伴與青年志工，依能力分組、調整陪同人力。" },
            ].map((p, i) => (
              <li key={p.t} className="flex gap-4">
                <span className="text-3xl font-black leading-none text-teal/40 tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-bold">{p.t}</h3>
                  <p className="mt-1 text-[15px] leading-7 text-ink-soft">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/about" className="mt-8 inline-flex items-center gap-1 font-bold text-teal hover:text-deep">認識俱樂部<Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* 5 海洋活動類型 */}
      <section className="bg-sand-50 py-20">
        <div className="container-page">
          <SectionTitle eyebrow="ACTIVITIES" title="找到你的海洋運動" lead="以下為俱樂部推動的活動類型，實際開課以活動日曆公告為準。" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((t) => {
              const cover = c.media.find((m) => m.theme === t.key && m.usage.includes("主題封面")) ?? c.media.find((m) => m.id === t.fallback);
              return (
                <Link key={t.key} href={t.href} className="card group overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-teal to-deep">
                    {cover ? <Photo m={cover} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw" /> : (
                      <div className="absolute inset-0 grid place-items-center text-white/25"><Icon name="wave" className="h-16 w-16" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="flex items-center justify-between text-lg font-bold group-hover:text-teal">{t.title}<Icon name="arrow" className="h-4 w-4 text-teal transition-transform group-hover:translate-x-1" /></h3>
                    <p className="mt-1 text-[15px] text-ink-soft">{t.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 最新活動及報名；沒有開放活動時改為年度活動回顧橫向瀏覽 */}
      <section className="py-20">
        <div className="container-page">
          <SectionTitle
            eyebrow={upcoming.length ? "UPCOMING" : "LATEST"}
            title={upcoming.length ? "近期活動與報名" : "最新活動"}
            lead={upcoming.length ? undefined : "新一季活動規劃中，報名開放時會在這裡與官方 LINE 公告。先看看 115 年度大家在海上做了什麼。"}
            action={{ href: "/activities", label: "看全部活動與日曆" }}
          />
        </div>
        {upcoming.length ? (
          <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((a) => <ActivityCard key={a.id} a={a} c={c} />)}
          </div>
        ) : (
          <div className="container-page">
            <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0">
              {recent.map((a) => {
                const m = a.coverId ? mm.get(a.coverId) : undefined;
                const d = formatDate(a.date);
                return (
                  <li key={a.id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]">
                    <Link href={`/activities/${a.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-deep">
                      {m ? <Photo m={m} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 80vw, 33vw" /> : null}
                      <span className="absolute inset-0 bg-gradient-to-t from-deep-900/90 via-deep-900/10 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <span className="text-sm font-bold text-sand">{d.full}｜活動回顧</span>
                        <span className="mt-1 block text-xl font-black leading-snug">{a.name}</span>
                        {a.headcount ? <span className="mt-1 block text-sm text-white/80">名冊 {a.headcount} 人次</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/activities" className="btn-teal">看活動日曆<Icon name="arrow" className="h-4 w-4" /></Link>
              <LineCta url={line} />
            </div>
          </div>
        )}
      </section>

      {/* 7 水域安全與科技體適能 */}
      <section className="bg-deep py-20 text-shallow">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Link href="/safety" className="group relative isolate overflow-hidden rounded-3xl p-8 ring-1 ring-white/10">
            {safetyPhoto ? <Photo m={safetyPhoto} className="absolute inset-0 -z-10 opacity-30 transition-opacity duration-500 group-hover:opacity-40" sizes="(max-width: 1024px) 100vw, 50vw" /> : null}
            <span className="absolute inset-0 -z-10 bg-gradient-to-br from-deep/80 to-deep-900/90" />
            <p className="eyebrow !text-sand">OCEAN SAFETY ACADEMY</p>
            <h2 className="mt-2 text-3xl font-black !text-white">海洋安全學院</h2>
            <p className="mt-3 text-[16px]">救生衣怎麼穿才對？天氣晴朗為什麼還是不能下水？用 10 題情境練習，搞懂風浪、潮汐、離岸流與救溺五步。</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-[15px] text-white">
              {["下水前準備", "救生衣與裝備", "風浪潮汐海流", "Go／No-Go 決策"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-sand" />{x}</li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-1 font-bold text-sand">開始 10 題情境練習<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/fitness" className="group rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition hover:bg-white/10">
            <p className="eyebrow !text-sand">TECH FITNESS CHECK-IN</p>
            <h2 className="mt-2 text-3xl font-black !text-white">科技體適能</h2>
            <p className="mt-3 text-[16px]">報到時量血氧、心率，做平衡與坐站評量，再自評體力、怕水與信心。教練依結果調整強度與陪同，讓每個人用適合自己的方式下水。</p>
            {kpi("K10") ? (
              <p className="mt-5 flex items-baseline gap-2 text-white">
                <span className="text-5xl font-black text-sand"><CountUp value={kpi("K10")!.actual} /></span>
                <span className="font-bold">人次完成檢測</span>
                <span className="text-sm text-shallow">（115 年度，達成率 {achievement(kpi("K10")!.target, kpi("K10")!.actual)}）</span>
              </p>
            ) : null}
            <span className="mt-6 inline-flex items-center gap-1 font-bold text-sand">了解檢測流程<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </section>

      {/* 8 115年度成果亮點：全幅照片＋數字動畫 */}
      {k01 && y115 ? (
        <section className="relative isolate overflow-hidden py-20 text-white" aria-labelledby="highlights">
          {resultsBg ? <Photo m={resultsBg} className="absolute inset-0 -z-10" sizes="100vw" /> : null}
          <div className="absolute inset-0 -z-10 bg-deep-900/80" />
          <div className="container-page">
            <p className="eyebrow !text-sand">{y115.year} HIGHLIGHTS</p>
            <h2 id="highlights" className="mt-2 text-[28px] font-black !text-white sm:text-[38px]">{y115.year}年度成果亮點</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1.6fr]">
              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm sm:p-8">
                <p className="font-bold text-shallow">年度任務參與</p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tight sm:text-7xl"><CountUp value={k01.actual} /></span>
                  <span className="text-xl font-bold text-sand">人次</span>
                </p>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15" role="img" aria-label={`目標 ${k01.target} 人次，達成率 ${achievement(k01.target, k01.actual)}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-shallow to-sand" style={{ width: "100%" }} />
                </div>
                <p className="mt-3 text-[15px] text-white/85">目標 {k01.target} 人次｜達成率 <b className="text-sand">{achievement(k01.target, k01.actual)}</b></p>
                <p className="mt-2 text-sm text-white/70">＝實體活動投保 {kpi("S01")?.actual} 人次＋線上安全教育 {kpi("S02")?.actual} 人次。「人次」是完成任務的次數，不等於實際人數。</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label} className="border-l-2 border-sand/60 pl-4">
                    <dt className="text-[15px] font-semibold text-shallow">{s.label}</dt>
                    <dd className="mt-1 text-4xl font-black tracking-tight sm:text-5xl">
                      <CountUp value={s.k!.actual} />
                      <span className="ml-1 text-base font-bold text-sand">{s.k!.actualUnit}</span>
                    </dd>
                    <dd className="mt-1 text-[13px] leading-5 text-white/70">{typeof s.note === "function" ? s.note(s.k!.target) : s.note}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Link href={`/results/${y115.year}`} className="btn-primary mt-10">進入{y115.year}年度成果館<Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </section>
      ) : null}

      {/* 9 精彩故事與照片 */}
      {stories.length ? (
        <section className="container-page py-20">
          <SectionTitle eyebrow="STORIES" title="海洋故事" lead="每一篇都來自實際辦理的活動與協會相簿。" action={{ href: "/stories", label: "看全部故事與照片牆" }} />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {(() => {
              const f = stories[0];
              const cover = f.coverId ? mm.get(f.coverId) : undefined;
              return (
                <Link href={`/stories/${f.id}`} className="group relative isolate block min-h-[420px] overflow-hidden rounded-3xl bg-deep">
                  {cover ? <Photo m={cover} className="absolute inset-0 -z-10 transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 60vw" /> : null}
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-900/95 via-deep-900/30 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                    <span className="text-sm font-bold text-sand">{formatDate(f.date).full}</span>
                    <span className="mt-2 block text-2xl font-black leading-snug sm:text-3xl">{f.title}</span>
                    {f.summary ? <span className="mt-2 block max-w-lg text-white/85">{f.summary}</span> : null}
                  </span>
                </Link>
              );
            })()}
            <div className="grid gap-6">
              {stories.slice(1, 3).map((s) => <StoryCard key={s.id} s={s} c={c} compact />)}
            </div>
          </div>
          {mosaic.length >= 4 ? (
            <Link href="/stories#photo-wall" className="group mt-6 grid grid-cols-3 gap-2 overflow-hidden rounded-3xl sm:grid-cols-5" aria-label="前往照片牆">
              {mosaic.map((m, i) => (
                <span key={m.id} className={`relative block aspect-square overflow-hidden ${i > 2 ? "hidden sm:block" : ""}`}>
                  <Photo m={m} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 33vw, 20vw" />
                </span>
              ))}
            </Link>
          ) : null}
          {quotes.length ? (
            <div className="mt-12">
              <p className="eyebrow">VOICES</p>
              <h3 className="mt-1 text-2xl font-black">參與者這樣說</h3>
              <div className="mt-5"><Quotes items={quotes} /></div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 10 海洋公民學習路徑 */}
      <section className="bg-shallow-50 py-20">
        <div className="container-page">
          <SectionTitle eyebrow="OCEAN CITIZEN PATHWAY" title="從第一次下水，到帶領別人" lead="海洋公民學習地圖分成七個階段，每一階段都有能力、安全重點與下一步方向。" action={{ href: "/pathway", label: "打開學習地圖" }} />
          <ol className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {PATHWAY.map((t, i) => (
              <li key={t} className="snap-start">
                <Link href={`/pathway#stage-${i + 1}`} className="group flex min-w-[150px] items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-deep/10 transition hover:ring-teal">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-deep font-black text-sand">{i + 1}</span>
                  <span className="font-bold text-deep group-hover:text-teal">{t}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 11 官方LINE與會員回流 */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal to-deep p-8 text-white sm:p-12">
          <Icon name="wave" className="absolute -right-6 -top-6 h-48 w-48 text-white/10" />
          <p className="eyebrow !text-sand">JOIN THE CLUB</p>
          <h2 className="mt-2 text-3xl font-black !text-white sm:text-4xl">下一次，一起去海邊運動吧！</h2>
          <p className="mt-3 max-w-xl text-white/90">加入官方LINE，接收活動公告、海況延期通知與俱樂部後續活動。報名以主辦單位公告的正式表單為準。</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LineCta url={line} />
            <Link href="/prepare" className="btn-outline text-white">第一次參加？看行前準備</Link>
          </div>
        </div>
      </section>
    </>
  );
}
