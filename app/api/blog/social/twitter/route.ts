import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { getDistributionKit } from "@/lib/blog";
import { parseDistributionKit, postToTwitter } from "@/lib/social";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, tweetIndex } = await request.json();

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const raw = getDistributionKit(slug.trim());
    if (!raw) {
      return NextResponse.json(
        { error: "No distribution kit found for this post" },
        { status: 404 }
      );
    }

    const kit = parseDistributionKit(raw);
    if (!kit.twitter || kit.twitter.length === 0) {
      return NextResponse.json(
        { error: "No Twitter/X copy found in distribution kit" },
        { status: 400 }
      );
    }

    const idx = typeof tweetIndex === "number" ? tweetIndex : 0;
    const text = kit.twitter[Math.min(idx, kit.twitter.length - 1)];

    const result = await postToTwitter(text);

    return NextResponse.json({
      success: true,
      platform: "twitter",
      postId: result.id,
      text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to post to Twitter";
    const status = message.includes("required") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
