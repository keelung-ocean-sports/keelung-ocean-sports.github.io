import { getPartners, resolveImage, asset } from "@/lib/content";
import { meta } from "@/lib/meta";
import { PageHero, Crumbs } from "@/components/ui";

export async function generateMetadata() {
  return meta({ title: "合作夥伴", description: "國立臺灣海洋大學教師團隊、德和國小、基隆市關懷據點促進會、基隆市聾啞福利協進會、基隆市信義區東信里辦公處。", path: "/partners/" });
}
export default async function Partners() {
  const list = await getPartners();
  return (
    <>
      <PageHero eyebrow="Partners" title="合作夥伴" lead="學術、學校、社區與共融支持，各自負責自己最擅長的部分。" img={await resolveImage("0926-fisher-point")} />
      <Crumbs items={[{ label: "合作夥伴" }]} />
      <ul className="wrap grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.id} className="card p-6">
            {p.logo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={asset(p.logo)} alt="" className="mb-3 h-12 w-auto" loading="lazy" />}
            <p className="text-sm font-bold text-tide-600">{p.role}</p>
            <h2 className="mt-1 text-xl">{p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer">{p.name}</a> : p.name}</h2>
            <p className="mt-2 text-ink-soft">{p.description}</p>
          </li>
        ))}
      </ul>
      <p className="wrap text-sm text-ink-soft">合作單位名稱與角色依115年度核定計畫書。</p>
    </>
  );
}
