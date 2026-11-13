import Link from "next/link";
import { NAV, MORE } from "@/lib/site";
import { asset, getSettings } from "@/lib/content";

export async function SiteFooter() {
  const s = await getSettings();
  return (
    <footer className="mt-24 bg-abyss text-white/85">
      <div className="wave opacity-60" aria-hidden="true" />
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold text-white">{s.siteName}</p>
          <p className="mt-1 text-sm">{s.tagline}</p>
          <div className="mt-5 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/chaojing-association-logo.png")} alt="" width={44} height={44} className="h-11 w-11 rounded-full bg-white object-contain p-1" />
            <p className="text-sm leading-6">營運單位<br /><span className="font-semibold text-white">{s.org}</span></p>
          </div>
          <p className="mt-5 text-sm leading-6">{s.fundingNote}</p>
          {s.contactNote && <p className="mt-2 text-sm leading-6">{s.contactNote}</p>}
        </div>
        <nav aria-label="網站導覽">
          <ul className="space-y-2 text-sm">{NAV.map((n) => <li key={n.href}><Link href={n.href} className="text-white/85 no-underline hover:text-white hover:underline">{n.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="更多內容">
          <ul className="space-y-2 text-sm">
            {MORE.map((n) => <li key={n.href}><Link href={n.href} className="text-white/85 no-underline hover:text-white hover:underline">{n.label}</Link></li>)}
            {s.orgSite && <li><a href={s.orgSite} className="text-white/85 hover:text-white">協會：基隆海洋運動俱樂部網站</a></li>}
          </ul>
        </nav>
      </div>
      <p className="wrap border-t border-white/10 py-5 text-xs text-white/60">© {s.org}｜照片為協會活動實拍</p>
    </footer>
  );
}
