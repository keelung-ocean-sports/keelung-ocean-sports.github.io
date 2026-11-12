"use client";
import { useState } from "react";
import { Icon } from "./Icon";

type Q = { q: string; options: string[]; answer: number; why: string };

/** 情境練習題：僅供學習，不送出、不記錄、不等於正式安全教育任務。 */
export const QUESTIONS: Q[] = [
  {
    q: "你在岸邊看到有人在水中掙扎呼救，第一個動作應該是？",
    options: ["馬上跳下水把人拉上來", "大聲呼救，並請旁人打 119 或 118", "先拍影片留下紀錄", "跑去找救生衣再自己游過去"],
    answer: 1,
    why: "救溺五步是「叫、叫、伸、拋、划」：先大聲呼叫周邊的人協助，再撥打 119（消防）或 118（海巡）。沒有受過救生訓練的人直接下水，常常變成第二個溺水者。",
  },
  {
    q: "呼救後，岸上的人身邊有竹竿、繩子和寶特瓶，比較適合的做法是？",
    options: ["用竹竿或繩子伸給對方，或拋出可漂浮的物品", "叫對方自己游回來", "手牽手組成人鏈走進水裡", "等救生員到了再說，什麼都不做"],
    answer: 0,
    why: "「伸」與「拋」都是在岸上進行：伸出竹竿、繩子，或拋出寶特瓶、浮板等可漂浮物，讓對方抓住，救援者自己不必下水。",
  },
  {
    q: "穿好救生衣後，怎麼檢查有沒有穿對？",
    options: ["看起來有穿上就好", "拉鍊拉一半比較好呼吸", "扣好所有扣環、束緊束帶，請別人往上拉肩部，救生衣不會滑過下巴或耳朵", "越鬆越舒服，下水比較好動"],
    answer: 2,
    why: "救生衣太鬆，落水時會往上滑，甚至從身上脫出。所有扣環都要扣上並調整束帶，往上拉肩帶確認不會滑到下巴或耳朵以上。兒童要選適合體重的尺寸。",
  },
  {
    q: "活動當天陽光普照，但教練宣布「今天不下水，改成岸上課程」。你應該怎麼想？",
    options: ["天氣這麼好，教練太保守了", "自己偷偷下水試試看", "要求退費並離開", "風浪、湧浪、潮汐和海流不一定看得出來，尊重教練的 Go／No-Go 判斷"],
    answer: 3,
    why: "晴天不等於海況安全。遠方天氣系統造成的湧浪、強風、潮汐變化與海流，岸上不一定看得出來。教練會綜合預報、現場觀察與參與者狀況做決定。",
  },
  {
    q: "昨晚沒睡好，今天早上還有點頭暈。報到時你應該？",
    options: ["主動告訴教練，讓教練評估要不要調整或暫不下水", "不要說，怕被取消資格", "多喝咖啡提神就好", "吃完早餐馬上下水就會好"],
    answer: 0,
    why: "身體不適時下水，風險會明顯提高。主動告知不是被淘汰，而是讓教練調整強度、安排近岸活動或加強陪同。安全測驗中，100% 的參與者都表示願意主動告知。",
  },
  {
    q: "划 SUP 時不小心落水了，最好的做法是？",
    options: ["趕快游向岸邊", "把板子推開，避免被打到", "先保持冷靜，靠救生衣浮起來，抓住板子或腳繩，等待或回到板上", "潛到水下躲浪"],
    answer: 2,
    why: "SUP 板本身就是很好的浮具。落水時先放鬆、靠救生衣浮起，抓住板子再慢慢爬回板上，或舉手讓教練知道。離開板子獨自游泳會消耗體力。",
  },
  {
    q: "游泳時發現自己一直被往外海帶走（可能是離岸流），應該？",
    options: ["用盡全力直直往岸邊游", "往更外海游比較快", "脫掉救生衣游得比較快", "保持冷靜漂浮，舉手呼救；有體力時先往與岸邊平行的方向移動，脫離後再回岸"],
    answer: 3,
    why: "逆著離岸流直游回岸非常耗體力。先保持冷靜、漂浮求救，有體力時往與海岸平行的方向移動，離開水流範圍後再斜向回岸。最好的方法是在有人看守、教練指定的範圍內活動。",
  },
  {
    q: "浮潛時面鏡進水、呼吸管嗆到，你開始有點慌。比較好的處理是？",
    options: ["抬起頭、靠救生衣浮著，站穩或抓住浮具，舉手讓教練知道", "用力往下潛", "立刻把救生衣脫掉", "不理它，繼續往前游"],
    answer: 0,
    why: "先讓頭離開水面、靠救生衣漂浮，把呼吸調整回來，再處理面鏡。舉手示意讓教練或夥伴過來協助。慌張時亂動，反而更容易嗆水。",
  },
  {
    q: "下水活動時，哪一個習慣最能降低風險？",
    options: ["一個人去比較自由", "比賽誰離岸邊最遠", "和夥伴一起，隨時知道彼此位置，並在教練指定的範圍內活動", "長時間泡在水裡不休息"],
    answer: 2,
    why: "防溺十招提醒：不要落單、隨時注意同伴位置，也不要長時間浸泡在水中，以免失溫或體力透支。",
  },
  {
    q: "想自己出發去海邊前，可以先查什麼？",
    options: ["只看網路上的美照", "什麼都不用查，到了再說", "只看當天氣溫", "氣象預報、警特報、風浪與潮汐，以及 GoOcean 等海洋遊憩風險資訊"],
    answer: 3,
    why: "出發前先看氣象署預報與警特報、風浪與潮汐資訊，也可使用國家海洋研究院推出的 GoOcean 海洋遊憩風險資訊 App。到了現場仍要觀察實際狀況，不確定就不要下水。",
  },
];

export function SafetyQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const done = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === QUESTIONS[i].answer).length;

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 mb-6 border-b border-deep/10 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex items-center justify-between gap-4 text-[15px] font-semibold">
          <span>已作答 {done}／{QUESTIONS.length}</span>
          <span className="text-teal">答對 {correct} 題</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-shallow/40" aria-hidden>
          <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${(done / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <ol className="space-y-6">
        {QUESTIONS.map((q, qi) => {
          const picked = answers[qi];
          const answered = picked !== null;
          return (
            <li key={qi} className="card p-5 sm:p-6">
              <fieldset>
                <legend className="text-lg font-bold text-deep">
                  <span className="mr-2 text-teal">Q{qi + 1}</span>
                  {q.q}
                </legend>
                <div className="mt-4 grid gap-2">
                  {q.options.map((o, oi) => {
                    const isAnswer = oi === q.answer;
                    const isPicked = oi === picked;
                    const state = !answered ? "idle" : isAnswer ? "right" : isPicked ? "wrong" : "dim";
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={answered}
                        onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                        aria-pressed={isPicked}
                        className={`flex min-h-[48px] items-start gap-3 rounded-xl px-4 py-3 text-left text-[16px] ring-1 transition ${
                          state === "idle" ? "bg-white ring-deep/15 hover:bg-shallow-50 hover:ring-teal" :
                          state === "right" ? "bg-emerald-50 font-semibold text-emerald-900 ring-emerald-400" :
                          state === "wrong" ? "bg-rose-50 text-rose-900 ring-rose-300" : "bg-white text-ink-soft/70 ring-deep/10"
                        }`}
                      >
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-shallow/50 text-[13px] font-bold text-deep">
                          {state === "right" ? <Icon name="check" className="h-4 w-4" /> : String.fromCharCode(65 + oi)}
                        </span>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {answered ? (
                <div className={`mt-4 rounded-xl p-4 text-[15px] leading-7 ${picked === q.answer ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950"}`} role="status">
                  <p className="font-bold">{picked === q.answer ? "答對了！" : `正確答案是 ${String.fromCharCode(65 + q.answer)}`}</p>
                  <p className="mt-1">{q.why}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {done === QUESTIONS.length ? (
        <div className="mt-8 rounded-2xl bg-deep p-6 text-center text-white">
          <p className="text-2xl font-black">完成練習：答對 {correct}／{QUESTIONS.length} 題</p>
          <p className="mt-2 text-shallow">這是學習練習，不會記錄成績，也不代表完成正式安全教育任務或取得下水資格。</p>
          <button type="button" onClick={() => setAnswers(QUESTIONS.map(() => null))} className="btn-primary mt-4">重新練習</button>
        </div>
      ) : null}
    </div>
  );
}
