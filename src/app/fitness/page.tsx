import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { achievement, link, pickMedia } from "@/lib/view";
import { CountUp } from "@/components/CountUp";
import { SelfRating } from "@/components/SelfRating";
import { Icon } from "@/components/Icon";
import { Tabs } from "@/components/Tabs";
import { Callout, PageHero } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "科技體適能", description: "下水前科技體適能報到流程：血氧、心率、平衡、坐站評量與三項自評，以及教練安全分流。", alternates: { canonical: "/fitness/" } };

const ITEMS = [
  { n: "01", t: "報到及身體狀況確認", why: "確認今天身體有沒有不舒服、有沒有需要特別注意的狀況。", how: "簽到時由教練詢問睡眠、進食、感冒或受傷情形。", tip: "任何不適都請主動說，教練才能幫你調整。" },
  { n: "02", t: "血氧 SpO₂", why: "了解休息狀態下的血氧情形，作為教練觀察的參考之一。", how: "把指夾式血氧機夾在手指上，安靜坐著等數字穩定。", tip: "手冷、擦指甲油、晃動都可能影響讀數，必要時重測。" },
  { n: "03", t: "心率 PR", why: "了解休息時的心跳，搭配其他資訊觀察身體狀態。", how: "與血氧同時由血氧機讀取，或由教練量測。", tip: "剛走路、緊張、喝咖啡時心跳會偏快，休息後再量。" },
  { n: "04", t: "單腳站立或適應性平衡評量", why: "SUP 需要平衡感，這項幫助教練判斷要從跪姿還是站姿開始。", how: "依教練指示單腳站立；無法單腳站立者改用適應性平衡動作。", tip: "旁邊要有扶持物或人員保護，不勉強。" },
  { n: "05", t: "30 秒坐站或適應性動作評量", why: "了解下肢肌力與動作能力，安排划槳強度與休息。", how: "坐在椅子上，30 秒內反覆站起、坐下；需要時改為適應性動作。", tip: "感到不適立即停止。" },
  { n: "06", t: "體力自評 1–5 分", why: "你最了解自己今天的狀態。", how: "1 分代表體力很低，5 分代表體力很好。", tip: "照實填寫，沒有標準答案。" },
  { n: "07", t: "怕水程度 1–5 分", why: "讓教練知道你需要多少陪伴與適應時間。", how: "1 分代表不怕水，5 分代表非常怕水。", tip: "怕水很正常，教練會從岸邊與淺水開始。" },
  { n: "08", t: "下水信心 1–5 分", why: "信心程度會影響分組與教學節奏。", how: "1 分代表信心很低，5 分代表很有信心。", tip: "信心可以慢慢建立。" },
  { n: "09", t: "教練安全分流與必要調整", why: "把所有資訊放在一起，決定今天最適合你的參與方式。", how: "教練綜合檢測、自評、健康告知與當日海況，安排分組、強度與陪同。", tip: "分流是為了讓你玩得更安全，不是淘汰。" },
];

const TRIAGE = [
  { c: "bg-signal-go", t: "綠", d: "正常下水，依分組進行。" },
  { c: "bg-signal-caution", t: "黃", d: "降低強度、近岸活動或加強陪同。" },
  { c: "bg-signal-stop", t: "紅", d: "暫不下水，改岸上參與並由教練持續觀察。" },
];

const SOP = [
  "活動前：確認血氧機電量、備用電池、紀錄表與筆；檢測區設在遮陽處並備椅子與扶持物。",
  "報到：核對名冊並簽到，詢問睡眠、進食、身體狀況與用藥；兒童由家長陪同回答。",
  "量測：受測者坐下休息後量 SpO₂ 與 PR，讀數不穩或明顯異常時休息後重測，並請教練複核。",
  "動作評量：單腳站立與 30 秒坐站需有人在旁保護；無法執行者改適應性動作，不勉強。",
  "自評：請受測者自評體力、怕水、信心 1–5 分，教練不代填。",
  "分流：由安全負責教練綜合檢測、自評、健康告知與當日海況，勾選綠／黃／紅並註記調整方式。",
  "保存：紀錄表含個人健康資訊，活動後交由協會指定人員保存，不拍照外傳、不公開。",
];

export default async function FitnessPage() {
  const c = await getContent();
  const coachForm = link(c, "form_fitness_coach");
  const hero = pickMedia(c, ["M115-0801-am-tent-briefing"])[0];
  const years = c.kpis.filter((k) => k.id === "K10" && k.actual).sort((a, b) => b.year.localeCompare(a.year));
  const k10 = years[0];
  const rate = k10 ? achievement(k10.target, k10.actual) : null;

  const publicView = (
    <div>
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((i) => (
          <li key={i.n} className="card flex flex-col p-6">
            <span className="text-3xl font-black text-shallow">{i.n}</span>
            <h3 className="mt-1 text-xl font-bold">{i.t}</h3>
            <dl className="mt-3 space-y-2 text-[15px]">
              <div><dt className="inline font-bold text-teal">為什麼：</dt><dd className="inline">{i.why}</dd></div>
              <div><dt className="inline font-bold text-teal">怎麼做：</dt><dd className="inline">{i.how}</dd></div>
            </dl>
            <p className="mt-auto pt-4 text-sm text-ink-soft"><Icon name="info" className="mr-1 inline h-4 w-4" />{i.tip}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <SelfRating />
      <div className="card p-6">
        <h3 className="text-xl font-bold">教練怎麼使用這些結果？</h3>
        <div className="mt-4 grid gap-3">
          {TRIAGE.map((x) => (
            <div key={x.t} className="flex items-center gap-3 rounded-xl bg-shallow-50 p-4">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-black text-white ${x.c}`}>{x.t}</span>
              <p className="text-[15px]">{x.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[15px] text-ink-soft">分流由安全負責教練綜合判斷，不會只看單一數字自動決定，也會隨當天海況調整。</p>
      </div>
      </div>
    </div>
  );

  const coachView = (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="card p-6">
        <h3 className="text-xl font-bold">現場檢測 SOP</h3>
        <ol className="mt-4 space-y-3">
          {SOP.map((s, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-deep text-sm font-bold text-white">{i + 1}</span>{s}
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-4">
        <div className="card p-6">
          <h3 className="text-xl font-bold">A4 橫式紀錄表</h3>
          <p className="mt-2 text-[15px] text-ink-soft">「當日報到暨下水前科技體適能檢測紀錄表」空白版，每頁 10 人，含 SpO₂、PR、單腳站立、30 秒坐站、三項自評與綠／黃／紅分流欄位。</p>
          <a href="/downloads/115-fitness-checkin-record-a4-blank.pdf" download className="btn-teal mt-4"><Icon name="download" className="h-4 w-4" />下載空白紀錄表（PDF）</a>
          <p className="mt-2 text-xs text-ink-soft">表頭為115年度計畫版本；新年度使用前請更新計畫名稱與補助單位欄位。</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold">Google 正式檢測表單</h3>
          {coachForm ? (
            <a href={coachForm.url} target="_blank" rel="noopener noreferrer" className="btn-teal mt-4">開啟教練檢測表單<Icon name="external" className="h-4 w-4" /></a>
          ) : (
            <p className="mt-2 text-[15px] text-ink-soft">建置中。表單建立後，由協會在內容管理表「公開連結」填入填答網址即會出現在這裡。</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHero eyebrow="TECH FITNESS CHECK-IN" title="科技體適能" lead="下水前花 5 分鐘，讓教練更了解你今天的狀態，安排最適合你的下水方式。" image={hero} />
      {k10 ? (
        <section className="bg-deep text-white">
          <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-12">
            <div>
              <p className="text-sm text-shallow">{k10.year}年度科技體適能檢測</p>
              <p className="text-5xl font-black"><CountUp value={k10.actual} /><span className="ml-1 text-lg font-bold text-sand">{k10.actualUnit}</span></p>
            </div>
            <div>
              <p className="text-sm text-shallow">核定目標 {k10.target} {k10.targetUnit}</p>
              {rate ? <p className="text-5xl font-black text-sand">{rate.replace("%", "")}<span className="ml-1 text-lg font-bold">%</span></p> : null}
            </div>
            <p className="max-w-md text-[15px] text-shallow/90">{k10.actualNote || "實體活動參與者於報到時完成檢測。"}個別檢測數值屬健康資訊，不公開。</p>
          </div>
        </section>
      ) : null}
      <div className="container-page py-12">
        <div className="mb-8">
          <Callout kind="safety" title="重要說明">
            科技體適能是教練安全分流與戒護安排的參考，不是醫療診斷。網站不設定通用的血氧、心率或體能「合格門檻」，也不會依單一數值自動核准下水。個人檢測結果屬健康資訊，不會公開。
          </Callout>
        </div>
        <Tabs tabs={[{ id: "public", label: "民眾版", content: publicView }, { id: "coach", label: "教練版", content: coachView }]} />
      </div>
    </>
  );
}
