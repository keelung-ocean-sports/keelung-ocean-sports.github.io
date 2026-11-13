import Link from "next/link";
import { notFound } from "next/navigation";
import { getMethods, getSpecies, resolveImage, resolveImages } from "@/lib/content";
import { meta } from "@/lib/meta";
import { Crumbs, Field } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { Gallery } from "@/components/Gallery";
import { Share } from "@/components/Share";

export async function generateStaticParams() {
  return (await getMethods()).map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = (await getMethods()).find((x) => x.slug === slug);
  if (!m) return {};
  const img = await resolveImage(m.coverImage);
  return meta({ title: `${m.name}｜漁法圖鑑`, description: m.description, path: `/fishing-methods/${m.slug}/`, image: img?.src });
}

export default async function MethodDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = (await getMethods()).find((x) => x.slug === slug);
  if (!m) notFound();
  const cover = await resolveImage(m.coverImage, m.name);
  const gallery = await resolveImages(m.gallery);
  const species = (await getSpecies()).filter((s) => m.targetSpecies.includes(s.slug));
  return (
    <>
      <Crumbs items={[{ href: "/fishing-methods/", label: "漁法圖鑑" }, { label: m.name }]} />
      <article className="wrap grid gap-10 py-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Photo img={cover} priority sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] w-full" />
          {cover?.caption && <p className="mt-2 text-sm text-ink-soft">照片：{cover.caption}（八斗子漁港實景，非特定漁法示意）</p>}
          {gallery.length > 0 && <div className="mt-6"><Gallery images={gallery} label="漁港照片" /></div>}
        </div>
        <div>
          <p className="eyebrow">漁法圖鑑</p>
          <h1 className="mt-1 text-4xl">{m.name}</h1>
          <p className="mt-4 text-lg">{m.description}</p>
          {m.kidsMission && <p className="mt-5 rounded-2xl bg-coral-100 p-4"><span className="block text-sm font-bold text-coral-600">小偵探任務</span>{m.kidsMission}</p>}
          <dl className="mt-6">
            <Field label="怎麼運作">{m.howItWorks}</Field>
            <Field label="漁具">{m.gear}</Field>
            {species.length > 0 && <Field label="可能捕到"><ul className="flex flex-wrap gap-2">{species.map((s) => <li key={s.slug}><Link href={`/species/${s.slug}/`} className="btn-line text-sm">{s.name}</Link></li>)}</ul></Field>}
            <Field label="選擇性">{m.selectivity}</Field>
            <Field label="混獲與影響">{m.bycatch}</Field>
            <Field label="季節">{m.season}</Field>
            <Field label="在八斗子">{m.localContext}</Field>
            <Field label="資源管理">{m.sustainabilityNotes}</Field>
          </dl>
          <div className="mt-6"><Share title={`${m.name}｜漁法圖鑑`} /></div>
        </div>
      </article>
    </>
  );
}
