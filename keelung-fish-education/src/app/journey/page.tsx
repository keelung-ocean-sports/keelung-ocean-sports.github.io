import Link from "next/link";
import { photosFor, resolveImage } from "@/lib/content";
import { meta } from "@/lib/meta";
import { STOPS, type StopKey } from "@/lib/site";
import { PageHero, Crumbs } from "@/components/ui";
import { JourneyStrip } from "@/components/JourneyStrip";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";

export async function generateMetadata() {
  const img = await resolveImage("0919-harbor-walk");
  return meta({ title: "八斗子食魚學習路徑", description: "市場 → 漁港 → 潮間帶 → 海味餐桌：跟著一條魚的旅行，認識八斗子的漁產、漁法、海岸與飲食文化。", path: "/journey/", image: img?.src });
}

const DATA: Record<StopKey, { learn: string[]; lead: string; task: string; taskText: string; links: { href: string; label: string }[]; note?: string }> = {
  market: {
    lead: "市場是認識魚最快的地方。今天攤位上有什麼，就從什麼開始。",
    learn: ["國產漁產品與來源標示", "魚類、頭足類、蝦蟹、貝類、海菜", "鮮度怎麼看：外觀、顏色、觸感、氣味", "當季與料理用途"],
    task: "市場偵探任務", taskText: "找到 3 種以上在地常見漁產品，問一問今天它從哪裡來。",
    links: [{ href: "/species/", label: "海味圖鑑" }, { href: "/missions/", label: "任務 1：海鮮偵探" }],
    note: "市場魚貨會隨季節與漁況變化，當季魚種以活動當日實際魚貨為準。",
  },
  harbor: {
    lead: "八斗子漁港的漁船，船身上常掛滿大燈泡。那些燈、那些網和繩，都是在回答：魚是怎麼被捕到的？",
    learn: ["漁船與漁具", "棒受網、延繩釣、籠具、一支釣", "漁獲從哪裡來", "選擇性、混獲與資源管理"],
    task: "漁法配對", taskText: "把漁具和可能的漁獲配在一起，說出你的理由。",
    links: [{ href: "/fishing-methods/", label: "漁法圖鑑" }, { href: "/missions/", label: "任務 2：漁法配對" }],
  },
  tide: {
    lead: "退潮後的岩岸是一片生活地圖：海菜、甲殼類、小魚小貝，還有望海巷一帶石花菜採集與海女文化的記憶。",
    learn: ["海菜與石花菜", "潮間帶生物與棲地", "石花菜採集與海女文化", "永續採集與觀察守則"],
    task: "潮間帶觀察家", taskText: "找到一種海藻、一種甲殼類或貝類、一個棲地特徵。",
    links: [{ href: "/species/agar-seaweed/", label: "石花菜" }, { href: "/missions/", label: "任務 3：潮間帶觀察家" }],
    note: "觀察，不帶走。潮間帶只在安全可及區域進行，並依天候與潮汐調整；不適合下潮間帶時，改在岸上觀察站用樣本箱與圖卡完成等值任務。",
  },
  table: {
    lead: "把市場、漁港和潮間帶的線索帶進廚房：辨識、前處理、簡易烹調、試吃分享。",
    learn: ["食材前處理與安全操作", "國產水產品、地產地消", "慢魚三招：吃在地、吃當季、吃適量", "惜食、均衡飲食與尊重生命"],
    task: "今天這道菜從哪裡來？", taskText: "說出今天料理用了哪一種海味、它可能怎麼被捕到。",
    links: [{ href: "/materials/", label: "海味料理任務卡" }, { href: "/missions/", label: "任務 4：海味料理家" }],
  },
};

export default async function Journey() {
  const hero = await resolveImage("0919-harbor-walk");
  const keys = Object.keys(STOPS) as StopKey[];
  const photos = Object.fromEntries(await Promise.all(keys.map(async (k) => [k, await photosFor((p) => p.stop === k)] as const)));
  return (
    <>
      <PageHero eyebrow="Learning Journey" title="八斗子食魚學習路徑" lead="市場 → 漁港 → 潮間帶 → 海味餐桌。四站可以一天走完，也可以拆開來慢慢走。" img={hero} />
      <Crumbs items={[{ label: "學習路徑" }]} />
      <div className="wrap py-10"><JourneyStrip linkTo="" /></div>
      {keys.map((k, i) => {
        const s = STOPS[k], d = DATA[k];
        return (
          <section key={k} id={k} aria-labelledby={`h-${k}`} className={i % 2 ? "bg-harbor-50 py-16" : "py-16"}>
            <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="eyebrow">第 {s.n} 站｜{s.mission}</p>
                <h2 id={`h-${k}`} className="mt-1 flex items-center gap-3 text-3xl"><span className="grid h-12 w-12 place-items-center rounded-full bg-coral-600 text-white"><Icon name={k} /></span>{s.name}</h2>
                <p className="mt-4 text-lg">{d.lead}</p>
                <h3 className="mt-6 text-base">學什麼</h3>
                <ul className="mt-2 space-y-1.5">{d.learn.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-tide-600" />{x}</li>)}</ul>
                <div className="mt-6 rounded-2xl bg-coral-100 p-5">
                  <p className="text-sm font-bold text-coral-600">互動任務</p>
                  <p className="mt-1 text-lg font-bold text-abyss">{d.task}</p>
                  <p className="mt-1 text-[15px]">{d.taskText}</p>
                </div>
                {d.note && <p className="mt-4 rounded-xl border-l-4 border-tide-600 bg-tide-100/50 p-4 text-[15px]">{d.note}</p>}
                <div className="mt-6 flex flex-wrap gap-2">{d.links.map((l) => <Link key={l.href + l.label} href={l.href} className="btn-line text-sm">{l.label}</Link>)}</div>
              </div>
              <div>{photos[k].length ? <Gallery images={photos[k].slice(0, 6)} label={`${s.name}照片`} /> : <p className="rounded-2xl bg-white p-8 text-ink-soft ring-1 ring-abyss/10">{k === "market" ? "市場站的紀錄照片收錄在 10/17 共融場活動頁。" : ""}</p>}</div>
            </div>
          </section>
        );
      })}
    </>
  );
}
