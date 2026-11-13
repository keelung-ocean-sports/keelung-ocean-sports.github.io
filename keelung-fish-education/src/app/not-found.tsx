import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl">這一頁像退潮一樣不見了</h1>
      <p className="mt-3 text-ink-soft">網址可能已經變更。回首頁重新出發吧。</p>
      <Link href="/" className="btn-primary mt-8">回首頁</Link>
    </div>
  );
}
