import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl font-black">這一頁被浪帶走了</h1>
      <p className="mt-3 text-ink-soft">找不到這個頁面，可能活動已下架或網址有誤。</p>
      <Link href="/" className="btn-teal mt-6">回到首頁</Link>
    </div>
  );
}
