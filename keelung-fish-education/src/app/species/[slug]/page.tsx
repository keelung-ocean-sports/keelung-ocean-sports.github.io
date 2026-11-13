import Link from "next/link";
import { notFound } from "next/navigation";
import { getMethods, getSpecies, resolveImage, resolveImages } from "@/lib/content";
import { meta } from "@/lib/meta";
import { Crumbs, Field } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { Gallery } from "@/components/Gallery";
import { Share } from "@/components/Share";

export async function generateStaticParams() {
  return (await getSpecies()).map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getSpecies()).find((x) => x.slug === slug);
  if (!s) return {};
  const img = await resolveImage(s.coverImage);
  return meta({ title: `${s.name}｜海味圖鑑`, description: s.features || `${s.name}：八斗子海味圖鑑`, path: `/species/${s.slug}/`, image: img?.src });
}

export default async function SpeciesDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (await getSpecies()).find((x) => x.slug === slug);
  if (!s) notFound();
  const cover = await resolveImage(s.coverImage, s.name);
  const gallery = await resolveImages(s.gallery);
  const methods = (await getMethods()).filter((m) => s.fishingMethods.includes(m.slug));
  return (
    <>
      <Crumbs items={[{ href: "/species/", label: "海味圖鑑" }, { label: s.name }]} />
      <article className="wrap grid gap-10 py-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Photo img={cover} priority sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] w-full" />
          {cover?.caption && <p className="mt-2 text-sm text-ink-soft">{cover.caption}</p>}
          {gallery.length > 0 && <div className="mt-6"><Gallery images={gallery} label={`${s.name}相關照片`} /></div>}
        </div>
        <div>
          <p className="eyebrow">{s.category}</p>
          <h1 className="mt-1 text-4xl">{s.name}</h1>
          {s.localName && <p className="mt-1 text-lg text-ink-soft">也叫：{s.localName}</p>}
          {s.scientificName && <p className="mt-1 italic text-ink-soft">{s.scientificName}</p>}
          {s.kidsMission && <p className="mt-5 rounded-2xl bg-coral-100 p-4"><span className="block text-sm font-bold text-coral-600">小偵探任務</span>{s.kidsMission}</p>}
          <dl className="mt-6">
            <Field label="長什麼樣子">{s.features}</Field>
            <Field label="季節">{s.season}</Field>
            <Field label="來源">{s.origin}</Field>
            <Field label="怎麼看新鮮">{s.freshnessTips}</Field>
            <Field label="怎麼吃">{s.cooking}</Field>
            <Field label="市場小提醒">{s.marketTips}</Field>
            <Field label="永續選擇">{s.sustainability}</Field>
            {methods.length > 0 && <Field label="可能的漁法"><ul className="flex flex-wrap gap-2">{methods.map((m) => <li key={m.slug}><Link href={`/fishing-methods/${m.slug}/`} className="btn-line text-sm">{m.name}</Link></li>)}</ul></Field>}
          </dl>
          <div className="mt-6"><Share title={`${s.name}｜八斗子海味圖鑑`} /></div>
        </div>
      </article>
    </>
  );
}
