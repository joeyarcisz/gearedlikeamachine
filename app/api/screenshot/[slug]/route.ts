import { NextResponse } from "next/server";

export const maxDuration = 30;

const CHROMIUM_PACK =
  "https://github.com/nichochar/chromium-brotli-lambda/releases/download/chromium-pack-v143.0.0/chromium-v143.0.0-pack.tar";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://www.gearedlikeamachine.com");

  const targetUrl = `${siteUrl}/interactive/${slug}.html`;

  try {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1080, height: 1080 },
      executablePath: await chromium.executablePath(CHROMIUM_PACK),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1500));

    const screenshot = await page.screenshot({ type: "png" });
    await browser.close();

    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Screenshot failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
