import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { link, mediaByUsage, pickMedia } from "@/lib/view";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { SafetyQuiz } from "@/components/SafetyQuiz";
import { Callout, PageHero, SectionTitle } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "海洋安全學院", description: "下水前準備、救生衣、風浪潮汐海流、Go／No-Go 決策、救溺五步與 10 題安全情境練習。", alternates: { canonical: "/safety/" } };

const TOPICS = [
  { t: "下水前安全準備", d: ["完成主辦單位指定的線上安全教育任務", "前一晚睡飽、不空腹也不過飽", "報到時接受科技體適能檢測，身體不適主動告知", "聽完岸上說明、確認集合點與活動範圍"] },
  { t: "防溺與救溺", d: ["防溺十招：不落單、注意同伴位置、身體不適不下水、注意氣象、不在水中嬉鬧", "救溺五步：叫（呼救）、叫（撥 119／118）、伸、拋、划", "沒有受過救生訓練，不要直接下水救人"] },
  { t: "救生衣與裝備", d: ["全程穿著合身救生衣，扣好所有扣環並束緊", "往上拉肩帶檢查，不會滑過下巴", "SUP 使用腳繩；浮潛確認面鏡、呼吸管與蛙鞋尺寸", "裝備有破損立即告知，停用並更換"] },
  { t: "風浪、潮汐、海流與地形", d: ["晴天也可能有湧浪與強風", "漲退潮會改變水深、入水點與海流", "留意離岸流、礁岩、消波塊與船隻航道", "只在教練指定的範圍內活動"] },
  { t: "身體不適通報", d: ["頭暈、抽筋、寒冷發抖、胸悶，立即舉手示意", "抓住 SUP 板或浮具，靠救生衣漂浮等待", "教練與救生人員會協助回岸並評估"] },
  { t: "教練與救生人力", d: ["依參與人數、年齡、能力與活動類型配置教練與救生人力", "分組活動，教練掌握每組人數與位置", "共融與親子場次增加陪同人力"] },
];

const RESCUE = [
  { k: "叫", t: "大聲呼救", d: "喊「有人溺水！」請周邊的人一起協助。", land: true },
  { k: "叫", t: "撥打 119／118", d: "119 消防、118 海巡，說清楚地點與人數。", land: true },
  { k: "伸", t: "伸出長物", d: "竹竿、繩子、浮板伸給對方，人留在岸上。", land: true },
  { k: "拋", t: "拋出浮具", d: "寶特瓶、救生圈、冰桶等可漂浮物拋過去。", land: true },
  { k: "划", t: "划船救援", d: "由受過訓練者利用船隻或浮具接近，未受訓者不下水。", land: false },
];

const GONOGO = [
  { step: "查預報", d: "出發前查看氣象署預報、警特報、風浪潮汐與 GoOcean 等海洋遊憩風險資訊。" },
  { step: "看現場", d: "抵達後觀察實際風向風速、浪高、湧浪週期、海流、水色與入水點狀況。" },
  { step: "評估人", d: "整合報到檢測、自評與健康告知，確認每位參與者當天的狀態與能力。" },
  { step: "確認人力裝備", d: "確認教練、救生人力、救生衣尺寸、救援器材與通訊是否到位。" },
  { step: "做決定", d: "Go：照計畫進行。調整：改近岸、縮短時間、改岸上課程或改場。No-Go：延期或取消，並通知參與者。" },
];

export default async function SafetyPage() {
  const c = await getContent();
  const goocean = link(c, "goocean_app");
  const quizForm = link(c, "form_safety_quiz_115");
  const hero = pickMedia(c, ["M115-0802-am-safety-briefing"])[0];
  const photos = mediaByUsage(c, "安全教育").filter((m) => m.id !== hero?.id).slice(0, 4);

  return (
    <>
      <PageHero eyebrow="OCEAN SAFETY ACADEMY" title="海洋安全學院" lead="海洋運動的第一堂課，是學會判斷什麼時候可以下水、什麼時候該停下來。" image={hero ?? photos[0]} />

      <section className="container-page py-14">
        <SectionTitle eyebrow="BASICS" title="六個必懂的安全重點" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <div key={t.t} className="card p-6">
              <p className="text-sm font-black text-teal">0{i + 1}</p>
              <h3 className="mt-1 text-xl font-bold">{t.t}</h3>
              <ul className="mt-3 space-y-2 text-[15px]">
                {t.d.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-teal" />{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {photos.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {photos.map((m) => <Photo key={m.id} m={m} caption className="aspect-[4/3] rounded-2xl" sizes="(max-width: 640px) 100vw, 33vw" />)}
          </div>
        ) : null}
      </section>

      <section className="container-page pb-14" aria-labelledby="rescue">
        <SectionTitle id="rescue" eyebrow="RESCUE" title="救溺五步：叫、叫、伸、拋、划" lead="看到有人溺水，先在岸上做能做的事。沒有受過救生訓練，不要直接下水。" />
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {RESCUE.map((r, i) => (
            <li key={i} className={`rounded-2xl p-5 ring-1 ${r.land ? "bg-shallow-50 ring-teal/20" : "bg-amber-50 ring-amber-300"} ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
              <span className="flex items-baseline gap-2"><span className="text-4xl font-black text-deep">{r.k}</span><span className="text-sm font-bold text-teal">步驟 {i + 1}</span></span>
              <h3 className="mt-2 text-lg font-bold">{r.t}</h3>
              <p className="mt-1 text-[15px] leading-7 text-ink-soft">{r.d}</p>
              <p className={`mt-2 text-xs font-bold ${r.land ? "text-teal" : "text-amber-800"}`}>{r.land ? "岸上進行" : "限受訓人員"}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-deep py-16 text-shallow">
        <div className="container-page">
          <p className="eyebrow !text-sand">GO / NO-GO</p>
          <h2 className="mt-2 text-3xl font-black !text-white">Go／No-Go 決策流程</h2>
          <p className="mt-3 max-w-2xl">每一場水域活動出發前，教練都會依序確認這五件事。任何一項不通過，就調整活動或停止下水。</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-5">
            {GONOGO.map((g, i) => (
              <li key={g.step} className="relative rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sand text-lg font-black text-deep">{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold !text-white">{g.step}</h3>
                <p className="mt-1 text-[15px] leading-7">{g.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { c: "bg-signal-go", t: "Go 照計畫進行", d: "海況、人員、裝備都在可控範圍。" },
              { c: "bg-signal-caution", t: "調整", d: "近岸、縮短、改岸上課程或改場。" },
              { c: "bg-signal-stop", t: "No-Go 延期或取消", d: "以 LINE 或電話通知參與者。" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <span className={`h-4 w-4 shrink-0 rounded-full ${x.c}`} aria-hidden />
                <p><span className="font-bold text-white">{x.t}</span><br /><span className="text-sm">{x.d}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {goocean ? (
              <a href={goocean.url} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="external" className="h-4 w-4" />GoOcean 海況資訊入口</a>
            ) : null}
            <p className="text-sm text-shallow/80">網站不提供即時海況判斷；個人出遊請以官方預報與現場判斷為準。</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="quiz">
        <SectionTitle id="quiz" eyebrow="PRACTICE" title="安全情境練習 10 題" lead="點選答案後立即看到解析。這是學習練習，不會記錄成績。" />
        <div className="mb-6 space-y-3">
          <Callout kind="warn" title="練習題 ≠ 正式安全教育 ≠ 下水資格">
            正式安全教育任務請使用主辦單位提供的 Google 表單完成。網站練習結果不會送出，也不是下水資格證明。所有水域活動是否進行，由專業人員依當日海況、場域、參與者狀態與相關規範判斷。
          </Callout>
          {quizForm ? (
            <a href={quizForm.url} target="_blank" rel="noopener noreferrer" className="btn-teal">前往正式安全教育任務表單<Icon name="external" className="h-4 w-4" /></a>
          ) : (
            <p className="text-[15px] text-ink-soft">正式安全教育任務表單會在報名完成後，由主辦單位隨行前通知提供。</p>
          )}
        </div>
        <div className="mx-auto max-w-3xl"><SafetyQuiz /></div>
      </section>
    </>
  );
}
