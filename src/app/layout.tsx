import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getContent, PREVIEW_MODE } from "@/lib/cms";
import { lineUrl } from "@/lib/view";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PreviewBanner } from "@/components/PreviewBanner";
import { FloatingLine } from "@/components/FloatingLine";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "基隆海洋運動俱樂部｜一起去海邊運動吧！", template: "%s｜基隆海洋運動俱樂部" },
  description:
    "基隆市潮境理海生態保育協會推動的公益海洋運動平台：SUP、浮潛、親子與共融海洋活動，水域安全教育、科技體適能與年度成果。",
  openGraph: {
    title: "基隆海洋運動俱樂部｜一起去海邊運動吧！",
    description: "SUP、浮潛、親子與共融海洋活動，從安全開始，一起去海邊運動。",
    locale: "zh_TW",
    type: "website",
    siteName: "基隆海洋運動俱樂部",
    images: [{ url: "/media/115/0704-pm-sup-action.jpg", width: 1920, alt: "外木山海域划立式划槳（SUP）的參與者" }],
  },
  robots: PREVIEW_MODE ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0B3C49", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
        />
      </head>
      <body>
        {PREVIEW_MODE ? <PreviewBanner /> : null}
        <SiteHeader lineUrl={lineUrl(c)} />
        <main id="main">{children}</main>
        <SiteFooter c={c} />
        <FloatingLine url={lineUrl(c)} />
      </body>
    </html>
  );
}
