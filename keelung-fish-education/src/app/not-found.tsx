import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl">找不到這個頁面</h1>
      <p className="mt-3 text-ink-soft">網址可能已經變更，請回首頁重新瀏覽。</p>
      <Link href="/" className="btn-primary mt-8">回首頁</Link>
    </div>
  );
}
