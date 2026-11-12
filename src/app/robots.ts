import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_PREVIEW_MODE === "true") return { rules: { userAgent: "*", disallow: "/" } };
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return { rules: { userAgent: "*", allow: "/", disallow: ["/cms-check", "/api/"] }, sitemap: base ? `${base}/sitemap.xml` : undefined };
}
