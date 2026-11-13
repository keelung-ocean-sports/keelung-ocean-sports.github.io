import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getActivities, getMethods, getSpecies, getStories, getYears } from "@/lib/content";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["/", "/journey/", "/species/", "/fishing-methods/", "/activities/", "/missions/", "/materials/", "/inclusive/", "/stories/", "/about/", "/partners/"];
  const urls = [
    ...fixed,
    ...(await getYears()).map((y) => `/results/${y}/`),
    ...(await getActivities()).map((a) => `/activities/${a.slug}/`),
    ...(await getStories()).map((s) => `/stories/${s.slug}/`),
    ...(await getSpecies()).map((s) => `/species/${s.slug}/`),
    ...(await getMethods()).map((m) => `/fishing-methods/${m.slug}/`),
  ];
  return urls.map((u) => ({ url: SITE_URL + u }));
}
