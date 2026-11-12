import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/** 協會修改試算表後，可用 POST /api/revalidate?token=... 立即更新網站（不必等快取到期）。 */
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.CMS_CHECK_TOKEN || token !== process.env.CMS_CHECK_TOKEN) {
    return NextResponse.json({ ok: false, message: "通行碼錯誤" }, { status: 401 });
  }
  revalidateTag("cms");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, message: "已要求更新，重新整理頁面即可看到最新內容。" });
}
