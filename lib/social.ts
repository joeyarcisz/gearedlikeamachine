import crypto from "crypto";

// Parse distribution kit markdown into platform-specific copy
export interface DistributionKit {
  email: { subject: string; body: string } | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string[] | null;
}

export function parseDistributionKit(raw: string): DistributionKit {
  const sections = raw.split(/^## /m).filter(Boolean);
  const kit: DistributionKit = {
    email: null,
    instagram: null,
    linkedin: null,
    twitter: null,
  };

  for (const section of sections) {
    const lower = section.toLowerCase();

    if (lower.startsWith("email")) {
      const subjectMatch = section.match(/\*\*Subject:\*\*\s*(.+)/i);
      const bodyMatch = section.match(/\*\*Body:\*\*\s*([\s\S]+?)(?=\n##|\n\*\*|$)/i);
      kit.email = {
        subject: subjectMatch?.[1]?.trim() || "",
        body: bodyMatch?.[1]?.trim() || "",
      };
    } else if (lower.startsWith("instagram")) {
      const content = section.replace(/^instagram[^\n]*\n/i, "").trim();
      kit.instagram = content || null;
    } else if (lower.startsWith("linkedin")) {
      const content = section.replace(/^linkedin[^\n]*\n/i, "").trim();
      kit.linkedin = content || null;
    } else if (lower.startsWith("x/twitter") || lower.startsWith("twitter") || lower.startsWith("x ")) {
      const options = section.match(/\*\*Option \d+:\*\*\s*(.+)/gi);
      if (options) {
        kit.twitter = options.map((o) =>
          o.replace(/\*\*Option \d+:\*\*\s*/i, "").trim()
        );
      } else {
        // Fallback: grab non-header lines
        const lines = section
          .replace(/^[^\n]*\n/i, "")
          .split("\n")
          .map((l) => l.replace(/^[-*]\s*/, "").trim())
          .filter((l) => l.length > 0 && l.length <= 280);
        kit.twitter = lines.length > 0 ? lines : null;
      }
    }
  }

  return kit;
}

// --- X/Twitter API v2 (OAuth 1.0a) ---

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");

  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  return crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");
}

export async function postToTwitter(text: string): Promise<{ id: string }> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error("TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_SECRET are required");
  }

  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    apiSecret,
    accessSecret
  );

  const authHeader =
    "OAuth " +
    Object.entries({ ...oauthParams, oauth_signature: signature })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
      .join(", ");

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { id: data.data.id };
}

// --- LinkedIn API ---

export async function postToLinkedIn(text: string): Promise<{ id: string }> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN; // urn:li:person:xxx or urn:li:organization:xxx

  if (!accessToken || !authorUrn) {
    throw new Error("LINKEDIN_ACCESS_TOKEN and LINKEDIN_AUTHOR_URN are required");
  }

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
      },
      lifecycleState: "PUBLISHED",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn API error ${res.status}: ${err}`);
  }

  const postId = res.headers.get("x-restli-id") || "posted";
  return { id: postId };
}

// --- Instagram API (Meta Graph API) ---

export async function postToInstagram(caption: string): Promise<{ id: string }> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID are required");
  }

  // Instagram requires an image/video for feed posts.
  // For text-only, we create a "carousel" or image post.
  // Since blog posts will have a cover image, the caller should provide image_url.
  // For now, this creates a caption-only approach using a link sticker.
  // NOTE: Instagram API cannot post text-only. The full implementation
  // requires passing an image URL. This posts the caption with a placeholder.

  throw new Error(
    "Instagram API requires an image URL for each post. " +
    "Set up the full flow by providing a cover image URL in the distribution kit."
  );
}

export async function postToInstagramWithImage(
  caption: string,
  imageUrl: string
): Promise<{ id: string }> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID are required");
  }

  // Step 1: Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${accountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }),
    }
  );

  if (!containerRes.ok) {
    const err = await containerRes.text();
    throw new Error(`Instagram container error ${containerRes.status}: ${err}`);
  }

  const { id: containerId } = await containerRes.json();

  // Step 2: Publish
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${accountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.text();
    throw new Error(`Instagram publish error ${publishRes.status}: ${err}`);
  }

  const { id } = await publishRes.json();
  return { id };
}
