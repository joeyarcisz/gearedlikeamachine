import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { getDistributionKit } from "@/lib/blog";
import { parseDistributionKit, postToInstagramWithImage } from "@/lib/social";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, imageUrl } = await request.json();

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    if (!imageUrl?.trim()) {
      return NextResponse.json(
        { error: "imageUrl is required for Instagram posts" },
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
    if (!kit.instagram) {
      return NextResponse.json(
        { error: "No Instagram copy found in distribution kit" },
        { status: 400 }
      );
    }

    const result = await postToInstagramWithImage(kit.instagram, imageUrl.trim());

    return NextResponse.json({
      success: true,
      platform: "instagram",
      postId: result.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to post to Instagram";
    const status = message.includes("required") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
