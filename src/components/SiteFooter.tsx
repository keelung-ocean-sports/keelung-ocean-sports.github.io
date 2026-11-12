import Image from "next/image";
import Link from "next/link";
import type { Content } from "@/lib/cms-types";
import { lineUrl } from "@/lib/view";
import { Icon } from "./Icon";
import { NAV, NAV_SECONDARY } from "./nav";

export function SiteFooter({ c }: { c: Content }) {
  const line = lineUrl(c);
  const s = c.settings;
  return (
    <footer className="mt-24 bg-deep text-shallow">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="rounded-2xl bg-white p-2">
              <Image src={s.operator_logo || "/brand/chaojing-association-logo.png"} alt="基隆市潮境理海生態保育協會標誌" width={72} height={63} className="h-[63px] w-[72px] object-contain" />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-shallow/80">營運及主辦單位</p>
              <p className="text-lg font-bold text-white">{s.operator || "基隆市潮境理海生態保育協會"}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-shallow/90">
            基隆海洋運動俱樂部是基隆市潮境理海生態保育協會推動的公益海洋運動平台，主要場域為{s.main_venue || "基隆外木山海興"}。
          </p>
          <ul className="mt-4 space-y-1 text-[15px]">
            {s.contact_person ? <li>聯絡人：{s.contact_person}</li> : null}
            {s.contact_phone ? <li>電話：<a className="underline" href={`tel:${s.contact_phone.replace(/[^\d]/g, "")}`}>{s.contact_phone}</a></li> : null}
            {s.contact_email ? <li>信箱：<a className="underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li> : null}
            {s.contact_address ? <li>地址：{s.contact_address}</li> : null}
          </ul>
          {line ? (
            <a href={line} target="_blank" rel="noopener noreferrer" className="btn-line mt-6">
              <Icon name="line" />官方LINE聯繫
            </a>
          ) : null}
        </div>
        <nav aria-label="頁尾導覽">
          <p className="mb-3 text-sm font-bold tracking-widest text-white">網站導覽</p>
          <ul className="grid gap-2 text-[15px]">
            {[{ href: "/", label: "首頁" }, ...NAV, ...NAV_SECONDARY].map((n) => (
              <li key={n.href}><Link className="hover:text-white" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="text-[14px] leading-7 text-shallow/85">
          <p className="mb-3 text-sm font-bold tracking-widest text-white">年度計畫</p>
          {c.years.map((y) => (
            <p key={y.year} className="mb-3">
              <Link href={`/results/${y.year}`} className="font-semibold text-white underline-offset-4 hover:underline">{y.year}年度成果館</Link>
              <br />
              {y.sponsor ? `${y.sponsorLabel || "指導／補助單位"}：${y.sponsor}` : null}
            </p>
          ))}
          <p className="mt-4 text-[13px] text-shallow/70">
            各年度補助或指導單位僅適用於該年度計畫，不代表俱樂部全部營運均由該單位支持。
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-[13px] text-shallow/70 sm:flex-row sm:justify-between">
          <p>© 基隆市潮境理海生態保育協會｜基隆海洋運動俱樂部</p>
          <p>水域活動是否進行，以主辦單位與專業教練當日判斷及通知為準。</p>
        </div>
      </div>
    </footer>
  );
}
