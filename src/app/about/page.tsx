import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/cms";
import { lineUrl, mediaByUsage, parsePartners } from "@/lib/view";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Callout, LineCta, PageHero, SectionTitle } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "關於我們", description: "基隆海洋運動俱樂部與基隆市潮境理海生態保育協會：人與海洋共存的公益海洋運動平台。", alternates: { canonical: "/about/" } };

export default async function AboutPage() {
  const c = await getContent();
  const s = c.settings;
  const partners = Array.from(new Map(c.years.flatMap((y) => parsePartners(y.partners)).map((p) => [p.name, p])).values());
  const photo = mediaByUsage(c, "故事封面")[0];
  const teamPhoto = c.media.find((m) => m.id === "M115-0719-team-photo");

  return (
    <>
      <PageHero eyebrow="ABOUT US" title="關於我們" lead="一個從基隆外木山海岸出發、長期經營的公益海洋運動俱樂部。" image={teamPhoto ?? photo} />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionTitle eyebrow="THE CLUB" title="基隆海洋運動俱樂部是什麼？" />
          <div className="prose-zh text-[17px]">
            <p>{s.tagline_long}</p>
            <p>俱樂部不是一次性的體驗活動，而是希望讓參與者從第一次下水開始，逐步累積安全知識、運動能力與海洋觀察，願意再回來，甚至成為志工、助教，一起把海洋運動帶給更多人。</p>
          </div>
        </div>
        {photo ? <Photo m={photo} className="aspect-[4/3] rounded-3xl" caption /> : null}
      </section>

      <section className="bg-sand-50 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <div className="mx-auto w-48 rounded-3xl bg-white p-5 shadow-sm">
            <Image src={s.operator_logo || "/brand/chaojing-association-logo.png"} alt="基隆市潮境理海生態保育協會標誌" width={832} height={725} className="h-auto w-full" />
          </div>
          <div>
            <p className="eyebrow">OPERATOR</p>
            <h2 className="mt-2 text-3xl font-black">{s.operator || "基隆市潮境理海生態保育協會"}</h2>
            <div className="prose-zh mt-4 text-[17px]">
              <p>基隆市潮境理海生態保育協會是基隆海洋運動俱樂部的營運及主辦單位。協會以「人與海洋共存」為核心，將海洋運動、水域安全與海洋環境教育結合，在基隆在地海岸推動親海活動。</p>
              <p>網站上的活動、成果與資料由協會管理；各年度若有政府或其他單位補助，會在該年度成果館中分別標示。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle eyebrow="WHAT WE BELIEVE" title="我們相信的事" />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { t: "人與海洋共存", d: "海洋不只是運動場，也是需要被理解與守護的生活環境。活動中引導參與者觀察魚類、潮間帶生物與海漂垃圾，把親海經驗轉化為保護海洋的行動。" },
            { t: "海洋運動 × 環境教育", d: "在 SUP 與浮潛的過程中認識風浪、潮汐與海岸地形，運動能力與海洋素養同步成長。" },
            { t: "安全是專業，不是口號", d: "行前安全教育、科技體適能報到、教練 Go／No-Go 判斷與分組陪同，是每一場活動的標準流程。" },
            { t: "共融參與", d: "與社區關懷據點、基隆市聾啞協會等夥伴合作，調整活動節奏與陪同人力，讓長者、身心障礙夥伴與親子家庭都能參與。" },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <h3 className="text-xl font-bold">{x.t}</h3>
              <p className="mt-2 text-[16px] text-ink-soft">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-deep py-16 text-shallow">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-sand">TEAM & TALENT</p>
            <h2 className="mt-2 text-3xl font-black !text-white">教練團隊與人才培力</h2>
            <p className="mt-4">俱樂部由專業教練帶領活動，並透過專業技能培訓培育助教、救生人力與青年志工，建立從參與者到服務者的成長路徑。</p>
            <p className="mt-3 text-sm text-shallow/80">教練與團隊成員的姓名、資格與介紹，將在協會確認公開授權後於此處刊登。</p>
            <Link href="/pathway" className="btn-primary mt-6">看海洋公民學習地圖<Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          {teamPhoto ? <Photo m={teamPhoto} className="aspect-[4/3] rounded-3xl" caption /> : null}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle eyebrow="MEMBERSHIP" title="會員制度發展方向" />
        <Callout title="發展中，尚未正式實施">
          協會正規劃以「海洋公民歷程護照」銜接參與任務、積分與人才培力，並將資金池與留才機制列為制度發展方向。目前網站不提供會員登入、個人積分或證照認證；會員資訊與活動通知請先加入官方LINE。
        </Callout>
        <div className="mt-6"><LineCta url={lineUrl(c)} /></div>
      </section>

      {partners.length ? (
        <section className="container-page pb-8">
          <SectionTitle eyebrow="PARTNERS" title="合作與公共參與" lead="歷年合作的在地學校、團體與社區夥伴。" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <li key={p.name} className="card flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-shallow/40 text-deep"><Icon name="users" className="h-5 w-5" /></span>
                <span><span className="block text-xs font-bold text-teal">{p.kind}</span><span className="font-bold text-deep">{p.name}</span></span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
