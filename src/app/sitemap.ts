import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { getContent } from "@/lib/cms";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const c = await getContent();
  const paths = ["", "/about", "/activities", "/prepare", "/safety", "/fitness", "/stories", "/results", "/pathway",
    ...c.activities.map((a) => `/activities/${a.id}`), ...c.stories.map((s) => `/stories/${s.id}`), ...c.years.map((y) => `/results/${y.year}`)];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
