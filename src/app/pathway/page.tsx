import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PathwayMap, type Stage } from "@/components/PathwayMap";
import { Callout, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "海洋公民學習地圖", description: "從海洋運動入門到專業教練的 7 階段學習路徑：能力重點、安全重點與可參與活動。", alternates: { canonical: "/pathway/" } };

const STAGES: Stage[] = [
  { t: "海洋運動入門", skill: "認識救生衣與裝備、岸上動作、在教練帶領下完成第一次 SUP 或浮潛。", safety: "全程穿救生衣、不離開指定範圍、身體不適立即告知。", join: "SUP 入門體驗、浮潛親海體驗、親子海洋運動", next: "完成水域安全教育" },
  { t: "水域安全教育", skill: "理解防溺十招、救溺五步、風浪潮汐與 Go／No-Go 判斷。", safety: "知道什麼時候不該下水，學會岸上救援觀念。", join: "線上安全教育任務、安全學院練習、行前說明", next: "參加常態活動" },
  { t: "常態運動", skill: "穩定的划槳、平衡與浮潛技巧，能在分組中自主練習。", safety: "與夥伴互相照看，遵守教練分組與時間安排。", join: "SUP 常態訓練、浮潛活動、趣味競賽", next: "加入海洋觀察" },
  { t: "海洋觀察", skill: "記錄魚類、潮間帶生物、海藻珊瑚與海漂垃圾，理解人與海的關係。", safety: "觀察不觸碰、不採集，維持安全距離。", join: "活動後海洋觀察紀錄", next: "成為志工" },
  { t: "志工培力", skill: "協助報到、裝備整理、岸上引導與活動紀錄。", safety: "熟悉集合動線、緊急聯絡與通報流程。", join: "青年志工服務", next: "培訓成為助教" },
  { t: "助教", skill: "協助教練帶領分組、示範動作、陪同共融與親子學員。", safety: "完成專業技能培訓，熟悉救援器材與分流原則。", join: "專業技能培訓、助教培育", next: "進階訓練" },
  { t: "進階訓練與專業教練", skill: "進階 SUP、自由潛水銜接、救生員訓練與專業教練認證方向。", safety: "依各專業體系規定取得相應資格。", join: "進階訓練及自由潛水銜接、救生員培訓", next: "" },
];

export default function PathwayPage() {
  return (
    <>
      <PageHero eyebrow="OCEAN CITIZEN PATHWAY" title="海洋公民學習地圖" lead="從第一次下水，到成為帶領別人的人。看看每個階段要學什麼、注意什麼，可以參加哪些活動。" />
      <div className="container-page py-14">
        <PathwayMap stages={STAGES} />
        <div className="mt-10 space-y-4">
          <Callout title="第一版說明">
            學習地圖目前提供階段介紹與進階方向，暫不提供個人會員登入、個人積分、自動證照認證或個人歷程查詢。各階段是否開課，以活動日曆公告為準。
          </Callout>
          <Link href="/activities" className="btn-teal">看可以參加的活動<Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </div>
    </>
  );
}
