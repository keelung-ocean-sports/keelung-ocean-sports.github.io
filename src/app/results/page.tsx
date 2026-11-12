import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/cms";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/ui";

export const revalidate = 300;
export const metadata: Metadata = { title: "年度成果館", description: "基隆海洋運動俱樂部逐年活動紀錄、成果與 KPI。" };

export default async function ResultsIndex() {
  const c = await getContent();
  const years = [...c.years].sort((a, b) => b.year.localeCompare(a.year));
  return (
    <>
      <PageHero eyebrow="ANNUAL RESULTS" title="年度成果館" lead="每個年度獨立記錄計畫、活動、成果與佐證方式。後續年度會依相同架構逐年累積。" />
      <div className="container-page py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {years.map((y) => (
            <li key={y.year}>
              <Link href={`/results/${y.year}`} className="card group flex h-full flex-col gap-4 p-6 sm:p-8">
                <p className="text-6xl font-black text-shallow">{y.year}</p>
                <div>
                  <p className="text-sm font-bold text-teal">{y.program}</p>
                  <h2 className="mt-1 text-2xl font-black group-hover:text-teal">{y.name}</h2>
                </div>
                <p className="text-[15px] text-ink-soft">{y.period}｜{y.venue}</p>
                {y.sponsorLogo ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-soft">{y.sponsorLabel}</span>
                    <Image src={y.sponsorLogo} alt={`${y.sponsor}標誌`} width={437} height={120} className="h-auto w-40" />
                  </div>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1 font-bold text-teal">進入{y.year}年度成果館<Icon name="arrow" className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
          <li className="grid place-items-center rounded-2xl border-2 border-dashed border-deep/15 p-8 text-center text-ink-soft">
            <p><span className="block text-4xl font-black text-shallow">{years.length ? Number(years[0].year) + 1 : ""}</span>下一個年度的成果，將在這裡接續累積。</p>
          </li>
        </ul>
      </div>
    </>
  );
}
