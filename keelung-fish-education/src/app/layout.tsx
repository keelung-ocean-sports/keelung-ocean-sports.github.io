import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL.replace(/(https?:\/\/[^/]+).*/, "$1")),
  title: SITE_NAME,
  description: "從八斗子海岸到每張餐桌的海味學習旅程。基隆食魚教育平台與115年度食魚教育推廣計畫成果館。",
  icons: { icon: `${bp}/icon.svg` },
};
export const viewport: Viewport = { themeColor: "#0A2E42", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "基隆市潮境理海生態保育協會",
    url: SITE_URL + "/",
    logo: SITE_URL + "/brand/chaojing-association-logo.png",
  };
  return (
    <html lang="zh-Hant">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </body>
    </html>
  );
}
