import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/cms";
import { achievement, activeNotices, isUpcoming, lineUrl, mediaByUsage, yearRow } from "@/lib/view";
import { ActivityCard, StoryCard } from "@/components/cards";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Callout, Empty, LineCta, SectionTitle } from "@/components/ui";

export const revalidate = 300;

const THEMES = [
  { key: "SUP", title: "SUP 立式划槳", text: "從岸上站姿、跪姿到板上划槳，教練陪你一步一步找到平衡。", href: "/activities?type=SUP入門體驗" },
  { key: "浮潛", title: "浮潛親海", text: "穿好救生衣、戴上面鏡與呼吸管，看見外木山水面下的生命。", href: "/activities?type=浮潛親海體驗" },
  { key: "親子", title: "親子海洋運動", text: "大人小孩一起認識海、一起練習安全，把親海變成家庭日常。", href: "/activities?type=親子海洋運動" },
  { key: "共融", title: "共融及適應性活動", text: "與社福團體合作，調整節奏與陪同人力，讓更多人有機會下水。", href: "/activities?type=共融及適應性海洋活動" },
];

export default async function HomePage() {
  const c = await getContent();
  const line = lineUrl(c);
  const heroes = mediaByUsage(c, "首頁主視覺");
  const hero = heroes[0];
  const y115 = yearRow(c, "115");
  const upcoming = c.activities.filter((a) => isUpcoming(a));
  const notices = activeNotices(c);
  const stories = [...c.stories].reverse().slice(0, 3);
  const kpi = (id: string) => c.kpis.find((k) => k.year === "115" && k.id === id && k.confirm === "已列報");
  const highlights = [
    { k: kpi("K01"), label: "年度任務參與人次", sub: (k: any) => `目標 ${k.target} 人次｜達成率 ${achievement(k.target, k.actual)}` },
    { k: kpi("S01"), label: "實體活動名冊人次", sub: () => "10 個活動日、17 個時段" },
    { k: kpi("S02"), label: "線上安全教育任務", sub: () => "223 份作答，去重後計次" },
    { k: kpi("S04"), label: "整體滿意度（滿分 5）", sub: () => "96 份活動後回饋" },
  ].filter((h) => h.k);

  return (
    <>
      {/* 1–3 主視覺、名稱標語、行動按鈕 */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-deep text-white">
        {hero ? (
          <div className="absolute inset-0 -z-10 animate-kenburns">
            <Photo m={hero} className="h-full w-full" sizes="100vw" priority />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_10%,#1a8f99_0%,#0B3C49_55%,#072a33_100%)]" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep-900 via-deep-900/40 to-deep-900/5" />
        <div className="container-page pb-14 pt-32 sm:pb-20">
          <p className="animate-rise text-xs font-bold tracking-[0.3em] text-shallow sm:text-sm">KEELUNG OCEAN SPORTS CLUB</p>
          <h1 className="animate-rise mt-3 text-[34px] font-black leading-[1.15] !text-white min-[400px]:text-[38px] sm:text-6xl lg:text-7xl">
            基隆海洋運動俱樂部
          </h1>
          <p className="animate-rise-delay mt-4 text-2xl font-bold text-sand sm:text-3xl">{c.settings.slogan || "一起去海邊運動吧！"}</p>
          <p className="animate-rise-delay mt-4 max-w-xl text-[17px] text-white/90">
            在基隆外木山的海岸，從岸上認識裝備、練習動作，再由教練帶你安全下水。SUP、浮潛、親子與共融，每個人都有適合自己的第一步。
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            <Link href="/activities" className="btn-primary"><Icon name="calendar" />探索海洋活動</Link>
            {line ? (
              <a href={line} target="_blank" rel="noopener noreferrer" className="btn-outline text-white"><Icon name="line" />加入俱樂部 LINE</a>
            ) : null}
          </div>
          {hero ? <p className="mt-8 text-[12px] text-white/60">照片：{hero.caption || hero.alt}</p> : null}
        </div>
      </section>

      {/* 4 115年度補助單位獨立識別區 */}
      {y115 ? (
        <section aria-labelledby="sponsor-115" className="border-b border-deep/10 bg-white">
          <div className="container-page flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {y115.sponsorLogo ? (
                <Image src={y115.sponsorLogo} alt={`${y115.sponsor}標誌`} width={437} height={120} className="h-auto w-[200px] sm:w-[240px]" />
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

      {/* 5 理念 */}
      <section className="container-page py-20">
        <SectionTitle eyebrow="OUR WAY" title="讓海洋運動，成為基隆人的日常" lead={c.settings.tagline_long} action={{ href: "/about", label: "認識俱樂部" }} />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "shield" as const, t: "安全是第一堂課", d: "下水前完成安全教育、科技體適能報到與裝備確認；海況由教練做 Go／No-Go 判斷。" },
            { icon: "wave" as const, t: "人與海洋共存", d: "在運動中觀察海岸、海洋生物與海漂垃圾，把親海的感動變成守護海洋的行動。" },
            { icon: "users" as const, t: "每個人都能參與", d: "親子家庭、社區長者、身心障礙夥伴與青年志工，依能力分組、調整陪同人力。" },
          ].map((p) => (
            <div key={p.t} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-shallow/50 text-deep"><Icon name={p.icon} className="h-6 w-6" /></span>
              <h3 className="mt-4 text-xl font-bold">{p.t}</h3>
              <p className="mt-2 text-[15px] text-ink-soft">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 海洋活動 */}
      <section className="bg-sand-50 py-20">
        <div className="container-page">
          <SectionTitle eyebrow="ACTIVITIES" title="找到你的海洋運動" lead="以下為俱樂部推動的活動類型，實際開課以活動日曆公告為準。" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((t) => {
              const cover = c.media.find((m) => m.theme === t.key && m.usage.includes("主題封面"));
              return (
                <Link key={t.key} href={t.href} className="card group overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-teal to-deep">
                    {cover ? <Photo m={cover} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw" /> : (
                      <div className="absolute inset-0 grid place-items-center text-white/25"><Icon name="wave" className="h-16 w-16" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold group-hover:text-teal">{t.title}</h3>
                    <p className="mt-1 text-[15px] text-ink-soft">{t.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7 近期活動及報名 */}
      <section className="container-page py-20">
        <SectionTitle eyebrow="UPCOMING" title="近期活動與報名" action={{ href: "/activities", label: "看全部活動與日曆" }} />
        {upcoming.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((a) => <ActivityCard key={a.id} a={a} c={c} />)}
          </div>
        ) : (
          <Empty>
            <p className="text-lg font-bold text-deep">新一季活動規劃中</p>
            <p className="mt-2">目前沒有開放報名的活動。加入官方LINE，活動公告與報名資訊會第一時間通知你。</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <LineCta url={line} />
              <Link href="/activities" className="btn-outline text-deep">看115年度活動回顧</Link>
            </div>
          </Empty>
        )}
      </section>

      {/* 8–9 安全學院、科技體適能 */}
      <section className="bg-deep py-20 text-shallow">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Link href="/safety" className="group rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition hover:bg-white/10">
            <p className="eyebrow !text-sand">OCEAN SAFETY ACADEMY</p>
            <h2 className="mt-2 text-3xl font-black !text-white">海洋安全學院</h2>
            <p className="mt-3 text-[16px]">救生衣怎麼穿才對？天氣晴朗為什麼還是不能下水？用 10 題情境練習，搞懂風浪、潮汐、離岸流與救溺五步。</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-[15px] text-white">
              {["下水前準備", "救生衣與裝備", "風浪潮汐海流", "Go／No-Go 決策"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-sand" />{x}</li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-1 font-bold text-sand">進入安全學院<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/fitness" className="group rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition hover:bg-white/10">
            <p className="eyebrow !text-sand">TECH FITNESS CHECK-IN</p>
            <h2 className="mt-2 text-3xl font-black !text-white">科技體適能</h2>
            <p className="mt-3 text-[16px]">報到時量血氧、心率，做平衡與坐站評量，再自評體力、怕水與信心。教練依結果調整強度與陪同，讓每個人用適合自己的方式下水。</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-[15px] text-white">
              {["血氧 SpO₂／心率 PR", "單腳站立平衡", "30 秒坐站", "三項 1–5 分自評"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-sand" />{x}</li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-1 font-bold text-sand">了解檢測流程<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </section>

      {/* 10 精選海洋故事 */}
      {stories.length ? (
        <section className="container-page py-20">
          <SectionTitle eyebrow="STORIES" title="海洋故事" lead="每一篇都來自實際辦理的活動與協會相簿。" action={{ href: "/stories", label: "看全部故事" }} />
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((s) => <StoryCard key={s.id} s={s} c={c} />)}
          </div>
        </section>
      ) : null}

      {/* 11 115年度成果亮點 */}
      {highlights.length && y115 ? (
        <section className="bg-shallow-50 py-20">
          <div className="container-page">
            <SectionTitle
              eyebrow={`${y115.year} HIGHLIGHTS`}
              title={`${y115.year}年度成果亮點`}
              lead={`資料來源：${y115.source}。「人次」為任務人次，不等於不重複人數。`}
              action={{ href: `/results/${y115.year}`, label: "看完整成果與計算方法" }}
            />
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.label} className="card p-6">
                  <dt className="text-[15px] font-semibold text-ink-soft">{h.label}</dt>
                  <dd className="mt-2 text-5xl font-black tracking-tight text-deep">
                    {h.k!.actual}
                    <span className="ml-1 text-lg font-bold text-teal">{h.k!.actualUnit}</span>
                  </dd>
                  <dd className="mt-2 text-sm text-ink-soft">{h.sub(h.k)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* 12 會員回流 LINE */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal to-deep p-8 text-white sm:p-12">
          <Icon name="wave" className="absolute -right-6 -top-6 h-48 w-48 text-white/10" />
          <p className="eyebrow !text-sand">JOIN THE CLUB</p>
          <h2 className="mt-2 text-3xl font-black !text-white sm:text-4xl">下一次，一起去海邊運動吧！</h2>
          <p className="mt-3 max-w-xl text-white/90">加入官方LINE，接收活動公告、海況延期通知與俱樂部後續活動。報名以主辦單位公告的正式表單為準。</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LineCta url={line} />
            <Link href="/pathway" className="btn-outline text-white">看海洋公民學習地圖</Link>
          </div>
        </div>
      </section>
    </>
  );
}
